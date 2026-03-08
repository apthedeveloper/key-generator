# Key Generator

**Key Generator** is a Visual Studio Code extension that helps developers quickly generate API or localization keys from selected text and automatically replace the selected values with strongly-typed variables.

It removes the repetitive work of manually creating key constants and replacing values across your codebase.

This extension is especially useful for projects that use centralized key files, such as **localization systems or API constant files**.

---

# Features

## 1. Generate Keys

Generate key variables from selected text.

**Command**

```
ApDev: Generate Key
```

**What it does**

- Extracts keys from the selected text
- Generates variables inside the configured key file
- Keeps your key file automatically updated

**Example**

Input

```dart
"user_login"
"user_logout"
```

Generated in `api_keys.dart`

```dart
class ApiKeys {
  static const userLogin = "user_login";
  static const userLogout = "user_logout";
}
```

---

## 2. Copy Key Variable

Quickly copy the variable name for an existing key.

**Command**

```
ApDev: Copy Key
```

**What it does**

- Finds the variable associated with the selected key
- Copies the variable name to the clipboard

**Example**

If the key file contains

```dart
static const userLogin = "user_login";
```

Selecting

```
"user_login"
```

Copies

```
userLogin
```

to your clipboard.

---

## 3. Generate and Replace

Generate keys and automatically replace the selected text with the variable reference.


**Command**

```
ApDev: Generate and Replace
```

**What it does**

- Extracts keys from the selected text
- Generates missing variables inside the key file
- Replaces the selected text with the generated variable reference

**Example**

### Before

```dart
"user_login"
"user_logout"
"profile_update"
```

### Generated Key File

```dart
class ApiKeys {
  static const userLogin = "user_login";
  static const userLogout = "user_logout";
  static const profileUpdate = "profile_update";
}
```

### After Replacement

```dart
ApiKeys.userLogin
ApiKeys.userLogout
ApiKeys.profileUpdate
```

---

# Supported Input Formats

The extension can extract keys from multiple formats.

### Plain Text

```
user_login
```

### Quoted Text

```
"user_login"
```

### JSON Keys

```json
"user_login": "Login"
```

---

# Requirements

This extension requires:

- **Visual Studio Code 1.80+**
- A configured **key configuration file**

The extension reads configuration from a file where you define:

- the key file name
- template format
- variable naming style
- class name
- prefix used in replacement

---

# Extension Settings

This extension reads configuration values used to generate keys.

### Example Configuration

```json
{
  "apiKeysFileNameWithPath": "api_keys.dart",
  "apiKeyTemplate": "static const <KEY> = "<VALUE>";",
  "prefixedVariableName": "ApiKeys.",
  "variableCase": "camelCase",
  "apiClassName": "ApiKeys"
}
```

---

# Settings Explained

| Setting                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| apiKeysFileNameWithPath | File where generated keys will be stored    |
| apiKeyTemplate          | Template used to generate variables         |
| prefixedVariableName    | Prefix used when replacing selected text    |
| variableCase            | Naming style for variables                  |
| apiClassName            | Class where generated keys will be inserted |

---

# Usage

## Step 1

Select text in your file.

Example:

```dart
"user_login"
"user_logout"
```

---

## Step 2

Open the command palette:

```
Cmd + Shift + P
```

Run:

```
Key Generator
```
or
```
ApDev: Copy Key
```
or
```
ApDev: Generate and Replace
```


---

# Known Issues
1. Currently **Generate and Replace** only supports Quoted texts only

2. The extension assumes the key file contains a **single class structure**. If multiple classes exist in the file, insertion may occur in the wrong location.

Future versions will include **smarter class detection and parsing**.

---

# Release Notes

## 1.0.0

Initial release

Features:

- Key extraction from selected text
- Automatic key generation
- Automatic replacement of selected text
- Support for JSON keys and quoted strings

---

# Contributing

Contributions are welcome!

If you'd like to improve the extension:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

# Development

To run the extension locally:

```bash
npm install
npm run compile
```

Then press:

```
F5
```

This will open the **Extension Development Host** where you can test the extension.

---

# License

MIT License

---

# Author

Created by **Aman Mahavar**
