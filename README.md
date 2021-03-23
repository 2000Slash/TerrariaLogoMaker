## Description
This is a NodeJs Module that generates Terraria logos from text. I used the basic code from [https://github.com/darthmorf/Terraria-Logo-Maker-2](https://github.com/darthmorf/Terraria-Logo-Maker-2) but changed it a bit to make it a NodeJs Module. I also wrote it in typescript.

## Example Use:

For javascript:
```javascript
const generator = require("terrarialogomaker");
const fs = require("fs");

generator.createLogo("Hello World", true).then((image) => {
    fs.writeFileSync("image.png", image);
});
```

And typescript:
```typescript
import { createLogo } from "terrarialogomaker";
import { writeFileSync } from "fs";

createLogo("Hello World", true).then((image) => {
    writeFileSync("image.png", image);
});
```