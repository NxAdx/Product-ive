# Android Release Signing Setup

To allow your app to update without a "package conflict" error, you must use a permanent signing key. Follow these 3 steps to set up your repository for persistent updates.

## Step 1: Generate your Permanent Keystore
Open PowerShell in your project directory and run the following command. 
> [!IMPORTANT]
> **Choose a strong password** and remember it. You will need it for Step 2 and Step 3.

```powershell
keytool -genkey -v -keystore android/app/productive.jks -alias productive-key -keyalg RSA -keysize 2048 -validity 10000 -storepass YOUR_PASSWORD -keypass YOUR_PASSWORD -dname "CN=Productive User,O=Productive,C=US"
```
*(Replace `YOUR_PAS
SWORD` with a real password of your choice.)*

---

## Step 2: Encode the Keystore for GitHub
GitHub Secrets cannot store binary files directly, so we need to convert the `.jks` file into a text string (Base64). I have created a helper script for you.

Run this command in PowerShell:
```powershell
./scripts/encode-keystore.ps1
```
This will create a file named `keystore_base64.txt` and copy its content to your clipboard.

---

## Step 3: Add Secrets to GitHub
1. Go to your repository on GitHub.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Click **New repository secret** and add the following four secrets:

| Name | Value |
| :--- | :--- |
| `RELEASE_KEYSTORE` | Paste the content of `keystore_base64.txt` (the long string) |
| `RELEASE_KEYSTORE_PASSWORD` | The password you chose in Step 1 |
| `RELEASE_KEY_ALIAS` | `productive-key` |
| `RELEASE_KEY_PASSWORD` | The password you chose in Step 1 (usually the same) |

---

## Final Verification
Once the secrets are added, I will release **v1.1.4**. 
1. **Uninstall** the existing app one last time.
2. **Install v1.1.4**.
3. **From now on**, all future updates (v1.1.5, v1.2.0, etc.) will install perfectly over the top!

> [!CAUTION]
> **BACKUP YOUR KEY**: Copy `android/app/productive.jks` to a safe location (Cloud Drive, USB, or Password Manager). If you lose this file, you lose the ability to update your app.
