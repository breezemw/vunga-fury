import { expect, test } from '@playwright/test'

test.describe('VUNGA FURY browser flows', () => {
  test('renders every local application route', async ({ page }) => {
    const routes = [
      ['/', 'Optimize your video before uploading.'],
      ['/optimizer', 'Processing workspace'],
      ['/analyzer', 'Technical video inspection'],
      ['/settings', 'Application preferences'],
      ['/about', 'A private upload-preparation tool'],
    ] as const

    for (const [path, heading] of routes) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
      await expect(page.locator('html')).not.toHaveJSProperty('scrollWidth', 0)
    }
  })

  test('rejects an invalid local file without navigation or remote upload', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[type="file"]').setInputFiles('tests/fixtures/not-a-video.txt')

    await expect(page.getByRole('alert')).toContainText('Choose an MP4 or MOV video file.')
    await expect(page.getByRole('alert')).toContainText(
      'This file does not report a supported video MIME type.',
    )
    await expect(page).toHaveURL(/\/$/)
  })

  test('analyzes real local H.264 MP4 and MOV fixtures without upload', async ({ page }) => {
    for (const fixture of ['h264-30fps.mp4', 'h264-30fps.mov', 'h264-60fps.mp4']) {
      await page.goto('/')
      await page.locator('input[type="file"]').setInputFiles(`tests/fixtures/generated/${fixture}`)
      await expect(page.getByText('LOCAL VIDEO READY')).toBeVisible({ timeout: 30_000 })
      await expect(page.locator('video')).toBeVisible()
      await expect(page.getByText('320 × 568')).toBeVisible()
      await expect(page.getByText(/H\.264/).first()).toBeVisible()
      await expect(page.getByText(/AAC/).first()).toBeVisible()
    }
  })

  test('runs the real H.264 lossless remux and unlocks download only after verification', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'FFmpeg core test runs once on desktop Chromium',
    )
    await page.goto('/')
    await page
      .locator('input[type="file"]')
      .setInputFiles('tests/fixtures/generated/h264-30fps.mp4')
    await expect(page.getByText('LOCAL VIDEO READY')).toBeVisible({ timeout: 30_000 })
    await page.getByRole('link', { name: 'Optimizer' }).click()
    await page.getByRole('button', { name: 'PREPARE VIDEO ENGINE' }).click()
    await expect(page.getByText('VIDEO ENGINE READY')).toBeVisible({ timeout: 110_000 })
    await page.getByRole('button', { name: 'OPTIMIZE VIDEO' }).click()
    await expect(page.getByText('VIDEO STREAM PRESERVED')).toBeVisible({ timeout: 110_000 })
    await expect(page.getByRole('button', { name: 'DOWNLOAD OPTIMIZED VIDEO' })).toBeEnabled()
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'DOWNLOAD OPTIMIZED VIDEO' }).click(),
    ])
    expect(download.suggestedFilename()).toBe('h264-30fps_optimized.mp4')
  })

  test('runs the real H.264 Smart Conversion and verifies the re-encoded output', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'FFmpeg core test runs once on desktop Chromium',
    )
    await page.goto('/')
    await page
      .locator('input[type="file"]')
      .setInputFiles('tests/fixtures/generated/h264-30fps.mp4')
    await expect(page.getByText('LOCAL VIDEO READY')).toBeVisible({ timeout: 30_000 })
    await page.getByRole('link', { name: 'Optimizer' }).click()
    await page.getByText('SMART CONVERSION', { exact: true }).click()
    await page.getByRole('button', { name: 'PREPARE VIDEO ENGINE' }).click()
    await expect(page.getByText('VIDEO ENGINE READY')).toBeVisible({ timeout: 110_000 })
    await page.getByRole('button', { name: 'CONVERT VIDEO' }).click()
    await expect(page.getByText('VIDEO WAS RE-ENCODED', { exact: true })).toBeVisible({
      timeout: 110_000,
    })
    await expect(page.getByRole('button', { name: 'DOWNLOAD OPTIMIZED VIDEO' })).toBeEnabled()
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'DOWNLOAD OPTIMIZED VIDEO' }).click(),
    ])
    expect(download.suggestedFilename()).toBe('h264-30fps_optimized.mp4')
  })

  test('persists local settings and clears them on request', async ({ page }) => {
    await page.goto('/settings')
    await page.getByText('light', { exact: true }).click()
    await page.getByText('Smart Conversion', { exact: true }).click()
    await page.reload()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    await expect(page.getByRole('radio', { name: 'Smart Conversion' })).toBeChecked()
    await page.getByRole('button', { name: 'CLEAR LOCAL DATA' }).click()
    await expect(page.getByRole('status')).toHaveText(
      'Local settings and metadata history cleared.',
    )
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('keeps download guarded before verified output exists', async ({ page }) => {
    await page.goto('/optimizer')
    await expect(page.getByRole('button', { name: 'DOWNLOAD OPTIMIZED VIDEO' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'PREPARE VIDEO ENGINE' })).toBeDisabled()
  })

  test('supports keyboard mobile navigation and explicit conversion disclosure', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Mobile-specific navigation test')
    await page.goto('/optimizer')
    await page.getByRole('button', { name: 'MENU' }).click()
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).not.toBeVisible()
    await page.getByText('SMART CONVERSION', { exact: true }).click()
    await expect(
      page.getByText('This mode re-encodes the video and may change image quality.'),
    ).toBeVisible()
  })
})
