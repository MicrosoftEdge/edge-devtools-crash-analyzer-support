# Web demo

This demo illustrates using the Crash Analyzer support module in a web application. This application requires a Chromium-based browser >= m101, when the required functionality was introduced into V8.

Here's output from this demo:

```
Error: This demonstrates an error with multiple modules involved.
    at http://localhost:8081/demonstrate-error.mjs:9:11
    at invokeCallback (http://localhost:8081/invoke-callback.mjs:6:3)
    at demonstrateError (http://localhost:8081/demonstrate-error.mjs:8:3)
    at document.querySelector.onclick (http://localhost:8081/index.mjs:11:3)

Source modules:
    http://localhost:8081/demonstrate-error.mjs 29419082d04b55807d9ff0a3c915bdfdd67cde305449fb5f7273e9a704043dd2
    http://localhost:8081/invoke-callback.mjs 98db4ea4e74730b88f94c6e5a88de9e643e08befb7de9f99f552ae8fd39a3082
    http://localhost:8081/index.mjs 765828aac3c2bb366cff54e1ea12893d202b0641edabb4f2a3c2b71fa95989de
```

Firefox has an incompatible stack trace format, and does not support the `prepareStackTrace` extension:

```
demonstrateError/<@http://localhost:8081/demonstrate-error.mjs:9:11
invokeCallback@http://localhost:8081/invoke-callback.mjs:6:3
demonstrateError@http://localhost:8081/demonstrate-error.mjs:8:17
@http://localhost:8081/index.mjs:11:3
EventHandlerNonNull*@http://localhost:8081/index.mjs:10:10
```

However, adding this will not cause a problem in Firefox nonetheless.
