# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of SecondOrder seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email security details to: henry@kinwo.net
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to understand and address the issue promptly.

## Security Measures

This project implements the following security measures:

### Application Security
- **Security Headers**: Comprehensive HTTP security headers configured in `next.config.js`:
  - X-Frame-Options: Prevents clickjacking attacks
  - X-Content-Type-Options: Prevents MIME sniffing
  - Referrer-Policy: Controls referrer information
  - Permissions-Policy: Restricts browser features
  - Strict-Transport-Security: Enforces HTTPS
  - Content-Security-Policy: Mitigates XSS attacks

- **Framework Security**:
  - React's built-in XSS protection through JSX escaping
  - Next.js automatic security features
  - TypeScript strict mode for type safety

### Dependency Management
- Regular dependency updates
- Security audit checks during CI/CD
- Minimal external dependencies to reduce attack surface

### Code Quality
- TypeScript strict mode enabled
- ESLint with security-focused rules
- React strict mode for detecting potential issues

## Security Best Practices for Contributors

When contributing to this project:

1. **Never commit sensitive data**:
   - API keys, tokens, or credentials
   - Personal information
   - Environment variables (use `.env.local` for local development)

2. **Validate all user input** (if adding forms or API endpoints):
   - Sanitize and validate on both client and server
   - Use proper encoding for output
   - Implement rate limiting for APIs

3. **Keep dependencies updated**:
   - Review security advisories regularly
   - Update dependencies promptly when vulnerabilities are found
   - Use `npm audit` to check for known vulnerabilities

4. **Follow secure coding practices**:
   - Avoid using `dangerouslySetInnerHTML` without sanitization
   - Don't use `eval()` or similar dynamic code execution
   - Implement proper error handling without exposing sensitive details

## Security Considerations for Future Features

If implementing the following features, ensure proper security measures:

- **Authentication**: Use established libraries (NextAuth.js, Auth0)
- **API Routes**: Implement CSRF protection, rate limiting, and input validation
- **File Uploads**: Validate file types, scan for malware, limit file sizes
- **Database Integration**: Use parameterized queries to prevent SQL injection
- **Third-party Integrations**: Validate and sanitize all external data

## Acknowledgments

We appreciate the security research community and welcome responsible disclosure of vulnerabilities.

---

Last updated: 2026-01-02
