import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('should set all required security headers', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();

    const headers = response?.headers();
    expect(headers).toBeDefined();

    // X-Frame-Options
    expect(headers?.['x-frame-options']).toBe('DENY');

    // X-Content-Type-Options
    expect(headers?.['x-content-type-options']).toBe('nosniff');

    // X-DNS-Prefetch-Control
    expect(headers?.['x-dns-prefetch-control']).toBe('off');

    // Referrer-Policy
    expect(headers?.['referrer-policy']).toBe('strict-origin-when-cross-origin');

    // Strict-Transport-Security
    const hsts = headers?.['strict-transport-security'];
    expect(hsts).toBeDefined();
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
    expect(hsts).toContain('preload');

    // Content-Security-Policy
    const csp = headers?.['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    expect(csp).toContain("frame-ancestors 'none'");

    // Verify unsafe directives are NOT present in script-src
    const scriptSrcMatch = csp?.match(/script-src[^;]+/);
    if (scriptSrcMatch) {
      expect(scriptSrcMatch[0]).not.toContain('unsafe-eval');
      expect(scriptSrcMatch[0]).not.toContain('unsafe-inline');
    }

    // Permissions-Policy
    const permissions = headers?.['permissions-policy'];
    expect(permissions).toBeDefined();
    expect(permissions).toContain('camera=()');
    expect(permissions).toContain('microphone=()');
    expect(permissions).toContain('geolocation=()');
    expect(permissions).toContain('payment=()');
    expect(permissions).toContain('usb=()');
    expect(permissions).toContain('interest-cohort=()');
  });

  test('should have CSP that allows the site to function', async ({ page }) => {
    // Navigate to the page
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // Verify page loaded successfully
    await expect(page).toHaveTitle(/SecondOrder/i);

    // Check that no CSP violations occurred
    const violations: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Content Security Policy')) {
        violations.push(msg.text());
      }
    });

    // Wait a bit for any CSP violations to be logged
    await page.waitForTimeout(1000);

    // Assert no CSP violations
    expect(violations).toHaveLength(0);
  });
});
