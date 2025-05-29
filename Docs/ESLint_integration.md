# ESLint Integration Guidelines

## Workspace Configuration
This project uses npm workspaces with the following structure:
```
workspaces: [
  "apps/*",
  "packages/*"
]
```

### Package-Specific Configs
- The main ESLint config is in the root `.eslintrc.js`
- The web app has its own `.eslintrc.json` in `apps/web/`
- When integrating new packages:
  1. Start with the root config
  2. Only add package-specific overrides if necessary
  3. Document any package-specific rules

## Existing ESLint Setup
The project uses a comprehensive ESLint configuration:

### Base Configuration
```javascript
{
  root: true,
  extends: [
    'next/core-web-vitals',
    'airbnb',
    'airbnb-typescript',
    'prettier'
  ]
}
```

### Key Rules
- React components must use arrow functions
- No default props required
- Props spreading allowed
- Unused variables allowed if prefixed with `_`
- Prettier integration enabled

### Migration Strategy
1. Copy the root `.eslintrc.js` configuration
2. Review and merge any custom rules from your project
3. Test the combined configuration
4. Document any rule conflicts or overrides

## Dependency Versions
Exact versions required:
```
"@typescript-eslint/eslint-plugin": "^6.0.0",
"@typescript-eslint/parser": "^6.0.0",
"eslint": "^8.0.0",
"eslint-config-airbnb": "^19.0.0",
"eslint-config-airbnb-typescript": "^17.0.0",
"eslint-config-next": "14.0.0",
"eslint-config-prettier": "^9.0.0",
"eslint-plugin-import": "^2.0.0",
"eslint-plugin-jsx-a11y": "^6.0.0",
"eslint-plugin-prettier": "^5.0.0",
"eslint-plugin-react": "^7.0.0",
"eslint-plugin-react-hooks": "^4.0.0"
```

### Additional Dependencies
The Airbnb config requires:
- `eslint-plugin-import`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y`

## CI/CD Integration
While no CI/CD configuration was found, here are the recommended steps:

### Build Pipeline
Add to your CI workflow:
```yaml
- name: Lint
  run: npm run lint
```

### Pre-commit Hooks
The project has `lint-staged` installed. Add to package.json:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### Automated Fixes
1. Add to package.json scripts:
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

2. Configure VS Code settings:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Integration Steps
1. Install dependencies matching the versions above
2. Copy the root ESLint configuration
3. Set up pre-commit hooks with lint-staged
4. Add CI/CD lint checks
5. Configure editor settings for automated fixes
6. Test the setup with both codebases 