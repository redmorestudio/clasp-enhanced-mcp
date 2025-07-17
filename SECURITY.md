# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in clasp-enhanced-mcp, please:

1. **DO NOT** open a public issue
2. Email the details to [your-security-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

## Security Best Practices

When using clasp-enhanced-mcp:

1. **Never commit credentials**
   - Use clasp's built-in authentication
   - Do not hardcode API keys or tokens
   
2. **Keep dependencies updated**
   - Regularly run `npm audit`
   - Update packages when security patches are available

3. **Use proper file permissions**
   - Ensure `.clasprc.json` has restricted permissions
   - Keep your Google credentials secure

## Authentication Security

This MCP server relies on clasp's authentication mechanism, which stores credentials securely in your home directory. The server itself does not handle or store any credentials.
