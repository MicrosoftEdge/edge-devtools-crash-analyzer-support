# Node demo

This demo illustrates using the Crash Analyzer support module in a Node project. This application requires Node 19+
to function. However, it will work correctly on older versions of Node -- it just won't add the `Source Modules`
annotation.

Here's output from this demo in Node 16:

```cmd
> node dist/index
Error: This demonstrates an error with multiple modules involved.
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/demonstrate-error.js:7:15
    at invokeCallback (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/invoke-callback.js:5:5)
    at demonstrateError (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/demonstrate-error.js:6:5)
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:16:9
    at Generator.next (<anonymous>)
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:7:71
    at new Promise (<anonymous>)
    at __awaiter (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:3:12)
    at main (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:15:12)
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:19:1
```

And from Node 20:

```cmd
> node20 dist/index
Error: This demonstrates an error with multiple modules involved.
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/demonstrate-error.js:7:15
    at invokeCallback (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/invoke-callback.js:5:5)
    at demonstrateError (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/demonstrate-error.js:6:5)
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:16:9
    at Generator.next (<anonymous>)
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:7:71
    at new Promise (<anonymous>)
    at __awaiter (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:3:12)
    at main (file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:15:12)
    at file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js:19:1

Source modules:
    file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/demonstrate-error.js 5850b5a4d8a81099986b9c4035cbaa7d981ddaa0c39e3faf1604132684493cd4
    file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/invoke-callback.js 9a86fa0e723d2ec0b7b79383fd94f0c468140b43fbd5ba17c4a833b492a6d3aa
    file:///C:/projects/@msft/edge-devtools-crash-analyzer-support/demo/node/dist/index.js 6cdea6ac6e18ebb3197f995d14d9714cdf8d5bfbecc7b30c7401a67945c0b6d0
```

# Inclusion

At your application's entrypoint, you can import the installation function from the module:

```js
// CommonJS import:
const { installErrorStackModuleAnnotations } = require('@microsoft/edge-devtools-crash-analyzer-support');
// ES Module import
import { installErrorStackModuleAnnotations } from '@microsoft/edge-devtools-crash-analyzer-support';

// Then install it:
installErrorStackModuleAnnotations(Error);
```

It's possible that you might need to include a `// @ts-ignore` or `// @ts-expect-error` comment ahead depending on
whether Node typings for `Error.prepareStackTrace` function. Alternatively, you can register it with an `as any` cast:

```ts
installErrorStackModuleAnnotations(Error as any);
```
