# Key Generator

A Visual Studio Code extension that generates strongly-typed API or localization key constants from selected text, and optionally replaces those strings with the generated variable references.

Ideal for projects that use centralized key files such as localization systems or API constant files.

---

## Features

### `ApDev: Generate Key`
Extracts keys from selected text and appends the generated variables to your configured key file.

### `ApDev: Copy Key`
Finds the variable associated with a selected key string and copies the variable name to your clipboard.

### `ApDev: Generate and Replace`
Generates missing variables in the key file **and** replaces the selected strings with their typed variable references in one step.

---

## Demo

**Input** (selected text in your file):
```
"user_login"
"user_logout"
"profile_update"
```

**Generated** in `api_keys.dart`:
```dart
class ApiKeys {
  static const userLogin = "user_login";
  static const userLogout = "user_logout";
  static const profileUpdate = "profile_update";
}
```

**After replacement** (in your source file):
```dart
ApiKeys.userLogin
ApiKeys.userLogout
ApiKeys.profileUpdate
```

---

## Supported Input Formats

| Format | Example |
|--------|---------|
| Plain text | `user_login` |
| Quoted string | `"user_login"` |
| JSON key | `"user_login": "Login"` |

---

## Requirements

- Visual Studio Code **1.80+**
- A configured key file (see [Configuration](#configuration))

---

## Configuration

Create a config file in your project with the following options:

```json
{
  "apiKeysFileNameWithPath": "api_keys.dart",
  "apiKeyTemplate": "static const <KEY> = <VALUE>;",
  "prefixedVariableName": "ApiKeys.",
  "variableCase": "camelCase",
  "apiClassName": "ApiKeys"
}
```

| Setting | Description |
|---------|-------------|
| `apiKeysFileNameWithPath` | Path to the file where generated keys are stored |
| `apiKeyTemplate` | Template for each variable. Use `<KEY>` and `<VALUE>` as placeholders |
| `prefixedVariableName` | Prefix used when replacing selected text (e.g. `ApiKeys.`) |
| `variableCase` | Naming convention for generated variables |
| `apiClassName` | Class name where keys will be inserted |

---

## Variable Naming Conventions

Configure `variableCase` to match your project's code style:

| `variableCase` value | Output for `user_login` |
|----------------------|-------------------------|
| `camelCase` | `userLogin` |
| `PascalCase` | `UserLogin` |
| `snake_case` | `user_login` |
| `UPPER_SNAKE_CASE` | `USER_LOGIN` |
| `kebab-case` | `user-login` |
| `train-case` | `User-Login` |
| `Title Case` | `User Login` |

---

## Usage

1. Select the key strings in your file
2. Open the command palette: `Cmd + Shift + P` (Mac) / `Ctrl + Shift + P` (Windows/Linux)
3. Run one of:
   - `ApDev: Generate Key` — generate variables only
   - `ApDev: Copy Key` — copy existing variable name
   - `ApDev: Generate and Replace` — generate and replace in one step

---

## Known Issues

- **Generate and Replace** currently supports quoted text only. Plain text and JSON formats are not yet supported for in-place replacement.
- The extension assumes a **single class structure** in the key file. If multiple classes exist, insertion may occur in the wrong location. Smarter class detection is planned for a future release.

---

## Release Notes

### 1.0.0
Initial release — key extraction, automatic generation, text replacement, JSON key support, and quoted string support.

---

## Development

```bash
npm install
npm run compile
```

Press `F5` to open the Extension Development Host and test the extension.

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## License

[MIT](LICENSE)

---

## Author

Created by **Aman Mahavar**