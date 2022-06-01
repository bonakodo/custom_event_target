# CustomEventTarget

Strictly-typed event emitter based on the native EventTarget Web API.

Events are defined as a literal object type where the key is the event name, and the value is any data passed when emitting the event.

```ts
import { CustomEventTarget } from 'https://deno.land/x/custom_event_target/mod.ts';

// Example: a chat app
type Contact = { name: string; age: number };
type Message = { text: string; timestamp: Date };
// ⚠️ Events must be a type and can't be an interface due to their design differences
type Events = {
  contact: Contact;
  messages: Message[];
};
class MyChat extends CustomEventTarget<Events> {}
const chat = new MyChat();

// Listen to all chat events
chat.all((event) => { // event: Contact | Messages[]
  if ('name' in event) {
    // `event` is Contact
  } else if (Array.isArray(event)) {
    // `event` is Messages
  }
});

function handleNewContact(contact: Contact) {
  console.log(`Hello ${contact.name} of ${contact.age} years old`);
}
// Add a listener to the contact event, save the reference to it for future (required to turn it off)
const contactListener = chat.on('contact', handleNewContact);
// Emit the contact event
chat.emit('contact', { name: 'John', age: 42 }); // "Hello John of 42 years old"
// Remove a listener from the contact event
chat.off('contact', contactListener);

// Same for the `messages` event
function handleMessages(messages: Message[]) {
  for (const message of messages) {
    console.log(
      `Received a message "${message.text}" on ${message.timestamp.toLocaleString()}`,
    );
  }
}
const messageListener = chat.on('messages', handleMessages);
chat.emit('messages', [{
  text: 'Hello world',
  timestamp: new Date(),
}]);
chat.off('messages', messageListener);
```

## License

Check [LICENSE](./LICENSE) for details.

Copyright © 2022 Bonakodo Limited

## See also

- [denosaurs/event](https://github.com/denosaurs/event) — Strictly-typed EventEmitter and AsyncIterator (MIT license).
