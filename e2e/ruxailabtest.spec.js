const { test, expect } = require('@playwright/test')
const { log } = require('console')

const logIn = async (page) => {
  await page.goto('/signin')

  await page.getByLabel('E-mail').fill('testemail@gmail.com')
  await page.getByLabel('Password', { exact: true }).fill('password123')

  await page
    .getByRole('main')
    .getByRole('button', { name: 'Sign-In' })
    .click()
}

const createTest = async (page, type) => {
  await page.click(
    'button.v-btn.v-btn--bottom.v-btn--is-elevated.v-btn--fab.v-btn--fixed.v-btn--has-bg.v-btn--right.v-btn--round',
  ) // Click new test button

  await page.click('.card-title:has-text("Create a blank test")')

  type === 'heuristic' && (await page.click('.card.col-sm-10.col-md-5.col-10')) // Press heuristic test card
  type === 'usability' && (await page.click('.card.col-sm-10.col-md-5.col-12')) // Press usability test card

  await page
    .getByRole('textbox', { name: 'Test Name' })
    .fill('Test heuristic playwright')
  await page
    .getByRole('textbox', { name: 'Test Description' })
    .fill('Some descripton')

  await page.click(
    '.ml-auto.mr-2.circleOrange.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default.orange',
  ) // Click create test button

  type === 'usability' && (await page.click('.card.col-sm-10.col-md-4.col-10')) // Click self test card

  await page.click(
    '.console-button.mx-1.hidden-sm-and-down.v-btn.v-btn--text.theme--dark.v-size--default',
  ) // Click go back to console button
}

test('has link page', async ({ page }) => {
  await page.goto('http://localhost:8080/signin')

  // Esperar un elemento específico
  await page.waitForSelector('#app', { timeout: 20000 })

  // Tomar una captura de pantalla para verificar el estado de la página
  await page.screenshot({ path: 'screenshot.png' })

  // Ahora verificar el título de la página
  await expect(page).toHaveTitle(/RUXAILAB/, { timeout: 20000 })
})

// test('sign and create heurisic test', async ({ page }) => {
//   await logIn(page)

//   await createTest(page, 'heuristic')
// })

// test('sign and create usability test', async ({ page }) => {
//   await logIn(page)

//   await createTest(page, 'usability')
// })

// test('sign and create template', async ({ page }) => {
//   /*login*/
//   await logIn(page)

//   await page.click(
//     'button.v-btn.v-btn--bottom.v-btn--is-elevated.v-btn--fab.v-btn--fixed.v-btn--has-bg.v-btn--right.v-btn--round',
//   ) // Click create new test button
//   await page.click('.card-title:has-text("Create from template")')

//   //create MARCTEST
//   await page.click('.v-list-item.v-list-item--link.theme--light') // Select template
//   await page.getByRole('button', { name: 'NEXT' }).click()
//   await page
//     .getByRole('textbox', { name: 'Title' })
//     .fill('Test template playwrigth')
//   await page
//     .getByRole('textbox', { name: 'Description' })
//     .fill('Some description for template')
//   await page.getByRole('button', { name: 'CREATE' }).click()

//   await page.click(
//     '.console-button.mx-1.hidden-sm-and-down.v-btn.v-btn--text.theme--dark.v-size--default',
//   ) // Click go back to console button
// })

// test('failure test heuristic', async ({ page }) => {
//   await logIn(page)

//   await page.click(
//     'button.v-btn.v-btn--bottom.v-btn--is-elevated.v-btn--fab.v-btn--fixed.v-btn--has-bg.v-btn--right.v-btn--round',
//   )
//   await page.click('.card-title:has-text("Create a blank test")')
//   await page.click('.card.col-sm-10.col-md-5.col-12')
//   await page
//     .getByRole('textbox', { name: 'Test Description' })
//     .fill('Some descripton')
//   await page.click(
//     '.ml-auto.mr-2.circleOrange.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default.orange',
//   )

//   const errorMessage = page.locator('div[role="alert"]')
//   await expect(errorMessage).toBeVisible()
//   await expect(errorMessage).toHaveText('Enter a Title')
// })

// test('Detalte test', async ({ page }) => {
//   await logIn(page)

//   await page.click(
//     'button.v-btn.v-btn--bottom.v-btn--is-elevated.v-btn--fab.v-btn--fixed.v-btn--has-bg.v-btn--right.v-btn--round',
//   )

//   await page.click('.card-title:has-text("Create a blank test")')
//   await page.click('.card.col-sm-10.col-md-5.col-12')

//   await page
//     .getByRole('textbox', { name: 'Test Name' })
//     .fill('Test heuristic playwright for delate')
//   await page
//     .getByRole('textbox', { name: 'Test Description' })
//     .fill('Some descripton')

//   await page.click(
//     '.ml-auto.mr-2.circleOrange.v-btn.v-btn--fab.v-btn--has-bg.v-btn--round.theme--dark.v-size--default.orange',
//   )
//   await page.click('.card.col-sm-10.col-md-4.col-10')
//   await page.click(
//     '.console-button.mx-1.hidden-sm-and-down.v-btn.v-btn--text.theme--dark.v-size--default',
//   )

//   await page.goto('/testslist')

//   await page.click('text=Test heuristic playwright for delate')
//   await page.click(
//     '.v-btn.v-btn--icon.v-btn--round.theme--light.v-size--default',
//   )
//   await page.click(
//     '.white--text.mb-4.v-btn.v-btn--is-elevated.v-btn--has-bg.theme--light.v-size--default',
//   )
//   await page.click(
//     '.red.white--text.ml-1.v-btn.v-btn--text.theme--light.v-size--default',
//   )
// })

// test('failure test template', async ({ page }) => {
//   logIn(page)

//   await page.click(
//     'button.v-btn.v-btn--bottom.v-btn--is-elevated.v-btn--fab.v-btn--fixed.v-btn--has-bg.v-btn--right.v-btn--round',
//   )
//   await page.click('.card-title:has-text("Create from template")')

//   await page.click('.v-list-item.v-list-item--link.theme--light')
//   await page.getByRole('button', { name: 'NEXT' }).click()
//   await page.getByRole('textbox', { name: 'Title' }).fill('')
//   await page
//     .getByRole('textbox', { name: 'Description' })
//     .fill('Some description for template')
//   await page.getByRole('button', { name: 'CREATE' }).click()

//   try {
//     await page.waitForSelector(
//       '.console-button.mx-1.hidden-sm-and-down.v-btn.v-btn--text.theme--dark.v-size--default',
//     )
//     await page.click(
//       '.console-button.mx-1.hidden-sm-and-down.v-btn.v-btn--text.theme--dark.v-size--default',
//       { timeout: 5000 },
//     )
//     await expect(page).toHaveURL('https://ruxailab-prod.web.app/testslist')
//   } catch {
//     console.error('Failed to click button or URL did not match:')
//     page.close()
//   }
// })
