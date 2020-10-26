# reactivity-ts &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

Reactive membrane written in Typescript.

Features:
    
- No thirdparty dependecies
- Easy to use
- ES Modules and CommonJS format
- Support `reactive`, `readonly`, `ref`
- Nice test

## Credits

The implementation of this module is inspired by [Observable Membrane](https://github.com/salesforce/observable-membrane) and [vue-next](https://github.com/vuejs/vue-next).

If you feel confused for "Membrane", you can check these articles:

- [Isolating application sub-components with membranes](https://tvcutsem.github.io/membranes)
- [Membranes in JavaScript](https://tvcutsem.github.io/js-membranes)

## Usage

The following example illustrates how to create a `Reactive Membrane` and reactive proxy:
```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = {
    a: 1,
    b: {
        c: 2
    }
}
const membrane = new ReactiveMembrane()
const wet = membrane.reactive(raw);
```

### Observing Access and Mutations

```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = {
    a: 1,
    b: {
        c: 2
    }
}
const membrane = new ReactiveMembrane({
    accessObserver(target, key) {
        console.log("access!");
    },
    mutationObserver(target, key) {
        console.log("mutation!");
    }
})
const wet = membrane.reactive(raw);

wet.a;          // access!
wet.a = 3;      // mutation
```

### Distortion

You can use distortions to avoid leaking non-observable objects and distorting values observed through the membrane:
```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = { a: 1 };
const membrane = new ReactiveMembrane({
    distortion(value) {
        if (typeof value === "number") {
            return value * 10
        }
        return value;
    }
})
const wet = membrane.reactive(raw);

wet.a;          // 10
```

### Readonly proxy

```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = {
    a: 1,
    b: {
        c: 2
    }
}
const membrane = new ReactiveMembrane({
    accessObserver(target, key) {
        console.log("access!");
    }
})
const wet = membrane.readonly(raw);

wet.a;          // access!
wet.a = 3;      // throw error in development mode, and does nothing in production mode.
```

### ref proxy

Internally, we wrap `raw` as an object which has getter and setter function.

```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = 1
const membrane = new ReactiveMembrane({
    accessObserver(target, key) {
        console.log("access!");
    },
    mutationObserver(target, key) {
        console.log("mutation!");
    }
})
const wet = membrane.ref(raw);

wet;            // access!
wet.value = 2;  // mutation!
```

### Shallow Reactive Proxy

Only create reactive proxy for root level properties.

```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = {
    a: 1,
    b: {
        c: 2
    }
}
const membrane = new ReactiveMembrane({
    mutationObserver(target, key) {
        console.log("mutation!");
    }
})
const wet = membrane.shallowReactive(raw);

wet.a = 3;      // mutation!
wet.b.c = 3;
```

__NOTE__: If you want to change the value of `raw.b.c`, you will access `raw.b` first. So the `accessObserver` will always be trigger.

### Shallow Readonly Proxy

Only create readonly proxy for root level properties.

```javascript
import { ReactiveMembrane } from "reactivity-ts";

const raw = {
    a: 1,
    b: {
        c: 2
    }
}
const membrane = new ReactiveMembrane();
const wet = membrane.shallowReadonly(raw);

wet.a = 3;      // throw error in development mode, and does nothing in production mode.
wet.b.c = 3;
```

__NOTE__: If you want to change the value of `raw.b.c`, you will access `raw.b` first. So the `accessObserver` will always be trigger.
