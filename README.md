# typed-emitter

Strongly typed event emitter

## ⚙️ Install

Install it locally in your project folder:

```bash
npm i typed-emitter
# Or Yarn
yarn add typed-emitter
```

## 📖 Usage

### Import

```typescript
import { Emitter } from "@satellite-im/typed-emitter"
```

### Declare event types

```typescript
interface MyListeners {
  'user:connect': (data: { userId: string }) => void
  'user:message': (data: { userId: string, message: string }) => void
}
```

### Inherit from emitter using generics

```typescript
class MyClass extends Emitter<MyListeners> {
    constructor() {
        // my initializations
    }

    connect() {
        // ...
        this.emit('user:connect', {userId: "591"}); // <- payload is strongly typed
    }

    onMessageReceived(userId: string, message: string) {
        // ...
        this.emit('user:message', {userId, message}) // <- payload is strongly typed
    }
}
```

### Subscribe to events in a strongly typed way

```typescript
const myClass = new MyClass();

myClass.on('user:connect', ({userId})=>{ // <- the callback signature is strongly typed
    // your code here
})

myClass.on('user:message', ({userId, message})=>{ // <- the callback signature is strongly typed
    // your code here
})
```


## 💬 Discussions

Join our discord server [here](https://discord.gg/NwrjYHj8) to share your ideas.

## License

MIT &copy; [Satellite.im](https://satellite.im)