/* eslint-disable max-len */

import { db } from '@/firebase'
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  collection,
  orderBy,
  limit,
  setDoc,
} from 'firebase/firestore'

/**
 * @typedef {Object} OrderBy
 * @property {string} field The field to be sorted.
 * @property {'asc'|'desc'} mode The sorting mode.
 */

/**
 * @typedef {'!='|'<'|'<='|'=='|'>'|'>='|'array-contains'|'array-contains-any'|'in'|'not-in'} Operator
 */

/**
 * @typedef {Object} Where
 * @property {string} field The field name to be used in the filtering.
 * @property {Operator} operator The operator to be used to compare the field with the value.
 * @property {any} value The value to be used on the comparison.
 */

/**
 * @typedef {Object} Query
 * @property {number} limit The amount of items to get.
 * @property {Where[]} where The filters to be applied.
 * @property {OrderBy[]} orderBy A list with all sorting fields.
 */

export default class Controller {
  // path - collection
  // data - document to insert (object)
  async create(col, payload) {
    return addDoc(collection(db, col), payload)
  }

  async set(col, docId, payload) {
    const ref = doc(db, `${col}/${docId}`)
    return setDoc(ref, payload)
  }

  async readOne(col, docId) {
    const ref = doc(db, `${col}/${docId}`)

    return getDoc(ref)
  }

  async query(col, params) {
    const q = query(
      collection(db, col),
      where(params.field, params.condition, params.value),
    )

    return getDocs(q)
  }

  /**
   * Fetches documents from a specified Firestore collection based on multiple query conditions.
   *
   * @param {string} col - The name of the collection from which to retrieve documents.
   * @param {Array<Object>} conditions - An array of condition objects, each specifying a field, 
   *                                     a comparison operator, and a value to filter by.
   * @param {string} conditions[].field - The name of the document field to filter on.
   * @param {string} conditions[].condition - The comparison operator to apply 
   *                                          (e.g., '==', '>=', '<=', '!=', etc.).
   * @param {*} conditions[].value - The value to compare against the specified field.
   *
   * @returns {Promise<QuerySnapshot>} - A Promise that resolves to a QuerySnapshot containing 
   *                                     the documents that match all the specified conditions.
   *
   * @example
   * const conditions = [
   *   { field: 'status', condition: '==', value: 'active' },
   *   { field: 'createdAt', condition: '>=', value: new Date('2023-01-01') },
   *   { field: 'role', condition: '==', value: 'admin' }
   * ];
   *
   * const results = await queryWithMultipleConditions('users', conditions);
   *
   * results.forEach(doc => {
   *   console.log(doc.id, " => ", doc.data());
   * });
   */
  async queryWithMultipleConditions(col, conditions) {
    const conditionArray = conditions.map((condition) =>
      where(condition.field, condition.condition, condition.value)
    );
  
    const q = query(collection(db, col), ...conditionArray);
  
    return getDocs(q);
  }

  

  /**
   * Makes a query to get data from the database.
   *
   * @param {string} col the collection name.
   * @param {Query} constraints the query to be used.
   * @returns {Promise<any[]>} the found entities.
   */
  async queryCustom(col, constraints = {}) {
    const { orderBy: ob = [], where: wh = [], limit: lm = 0 } = constraints

    const q = query(
      collection(col),
      ...ob.map((o) => orderBy(o.field, o.mode)),
      ...wh.map((w) => where(w.field, w.operator, w.value)),
      limit(lm),
    )

    const snap = await getDocs(q)

    return snap.docs.map((document) => ({
      ...document.data(),
      id: document.id,
    }))
  }

  /**
   * Gets a document data by its id and collection.
   *
   * @param {string[]} path the document path to be accessed.
   * @throws a Firebase exception.
   */
  async getById(path) {
    // return getDoc(doc(db, ...path));
    const docRef = doc(db, path[0], path[1])
    return getDoc(docRef)
  }

  async readAll(path) {
    const q = query(collection(db, path))
    const querySnapshot = await getDocs(q)

    const res = []

    querySnapshot.forEach((document) => {
      res.push(Object.assign(document.data(), { id: document.id }))
    })

    return res
  }

  async update(col, docId, payload) {
    try {
      const ref = doc(db, `${col}/${docId}`)
      return updateDoc(ref, payload)
    } catch(e) {
      console.log(e)
    }
  }

  async delete(col, docId) {
    return deleteDoc(doc(db, col, docId))
  }
}
