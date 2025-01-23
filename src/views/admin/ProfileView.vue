<template>
  <v-card class="profile-card mx-auto my-8" max-width="800" elevation="0">
    <v-card-title class="text-h5 pb-6">
      {{ $t('buttons.profile') }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="form-section mb-6">
        <label class="text-subtitle-1 text-medium-emphasis mb-2 d-block">
          Profile Image
        </label>
        <v-avatar size="120" class="mb-4">
          <v-img
            :src="userprofile.profileImage || 'https://via.placeholder.com/120'"
            alt="Profile"
          ></v-img>
        </v-avatar>
      </div>

      <div class="form-section mb-6">
        <label class="text-subtitle-1 text-medium-emphasis mb-2 d-block">
          {{ $t('SIGNIN.email') }}
        </label>
        <v-text-field
          v-model="user.email"
          tonal
          dense
          readonly
          background-color="white"
          hide-details
        ></v-text-field>
      </div>

      <div class="d-flex justify-space-between mt-8">
        <v-btn
          color="error"
          tonal
          class="px-6"
          height="40"
          @click="showDeleteModal = true"
        >
          {{ $t('buttons.deleteAccount') }}
        </v-btn>
      </div>
    </v-card-text>

    <!-- Delete Confirmation Modal -->
    <v-dialog v-model="showDeleteModal" max-width="400">
      <v-card class="pa-4">
        <v-card-title class="headline error white--text" primary-title>
          {{ $t('buttons.deleteAccount') }}
        </v-card-title>
        <v-card-text class="pa-0 mb-6">
          {{ $t('alerts.deleteAccount') }}
        </v-card-text>
        <v-card-actions class="pa-0">
          <v-spacer></v-spacer>
          <v-btn
            tonal
            class="mr-3 grey lighten-3"
            @click="showDeleteModal = false"
          >
            {{ $t('buttons.cancel') }}
          </v-btn>
          <v-btn color="error" tonal @click="deleteAccount">
            {{ $t('buttons.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore'
export default {
  data() {
    return {
      userprofile: {
        profileImage: 'https://picsum.photos/id/1005/400/300',
      },
      showDeleteModal: false,
    }
  },
  methods: {
  async deleteAccount() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        // Prompt the user for their password for reauthentication
        const email = user.email;
        const password = prompt('Please enter your password to confirm deletion:');
        if (!password) {
          alert('Password is required to delete your account.');
          return;
        }

        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);

        const db = getFirestore(); // Initialize Firestore
        const userDocId = user.uid; // Get the user's UID

        // Delete related Firestore data
        const testsCollectionRef = collection(db, 'tests');
        const testsQuery = query(testsCollectionRef, where('testAdmin.userDocId', '==', userDocId));
        const testsSnapshot = await getDocs(testsQuery);

        if (!testsSnapshot.empty) {
          for (const testDoc of testsSnapshot.docs) {
            const testData = testDoc.data();
            const answersDocId = testData.answersDocId;

            if (answersDocId) {
              const answersDocRef = doc(db, 'answers', answersDocId);
              await deleteDoc(answersDocRef);
            }

            const testDocRef = doc(db, 'tests', testDoc.id);
            await deleteDoc(testDocRef);
          }
        }

        // Delete user document from `users` collection
        const userDocRef = doc(db, 'users', userDocId);
        await deleteDoc(userDocRef);

        // Finally, delete the user's authentication account
        await user.delete();
        console.log('Account and related data deleted successfully.');

        // Redirect after successful deletion
        this.$router.push('/');
      } catch (error) {
        console.error('Error during account deletion:', error.message);
        alert('Failed to delete account. Please try again.');
      }
    } else {
      console.error('No user is signed in.');
    }
  },
},
  computed: {
    user() {
      return this.$store.getters.user || { email: '' } // Fallback if user is undefined
    },
  },
}
</script>

<style scoped>
.profile-card {
  background-color: #f8f9fe !important;
  border-radius: 8px !important;
}

.v-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
}

.v-text-field ::v-deep .v-input__slot,
.v-select ::v-deep .v-input__slot {
  min-height: 40px !important;
  box-shadow: none !important;
}

.form-section label {
  color: #666 !important;
}
</style>
