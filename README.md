# Absolute path to relative path codemod

from

```ts
import { foo } from "src/bar/foo";
```

to

```ts
import { foo } from "../../foo";
```

## Run example

```ts
yarn codemod
```
