#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const denylistedFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.development.local',
  '.env.production',
  '.env.production.local',
  '.env.test',
  '.env.test.local'
]

const secretPatterns = [
  { name: 'notion secret', pattern: /secret_[A-Za-z0-9]{20,}/ },
  { name: 'openai style key', pattern: /\bsk-[A-Za-z0-9_-]{20,}/ },
  { name: 'github token', pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}/ },
  {
    name: 'public secret env',
    pattern:
      /\bNEXT_PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|PRIVATE_KEY|ADMIN_APP_KEY|CLIENT_SECRET|API_KEY)[A-Z0-9_]*\s*=/
  },
  {
    name: 'literal secret assignment',
    pattern:
      /\b(SECRET|TOKEN|PASSWORD|PRIVATE_KEY|ADMIN_APP_KEY|CLIENT_SECRET)\b\s*[:=]\s*['"][^'"]{12,}['"]/i
  }
]

function listScannableFiles() {
  return execSync('git ls-files --cached --others --exclude-standard -z', {
    encoding: 'buffer'
  })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
}

function isTextFile(file) {
  return !/\.(png|jpe?g|gif|webp|ico|ttf|woff2?|mp4|pack|idx|rev)$/i.test(file)
}

function scan() {
  const files = listScannableFiles()
  const findings = []

  for (const file of files) {
    const base = path.basename(file)
    if (denylistedFiles.includes(base)) {
      findings.push({ file, line: 1, type: 'tracked env file' })
      continue
    }

    if (!isTextFile(file)) continue

    let text = ''
    try {
      text = fs.readFileSync(file, 'utf8')
    } catch {
      continue
    }

    text.split(/\n/).forEach((line, index) => {
      for (const rule of secretPatterns) {
        if (rule.pattern.test(line)) {
          findings.push({ file, line: index + 1, type: rule.name })
          break
        }
      }
    })
  }

  return findings
}

const findings = scan()

if (findings.length > 0) {
  console.error('Secret scan failed. Findings:')
  for (const finding of findings) {
    console.error(`${finding.file}:${finding.line} ${finding.type}`)
  }
  process.exit(1)
}

console.log('Secret scan passed.')
