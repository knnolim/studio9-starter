import { createApp, ref } from "vue";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiDecentralized } from "@graffiti-garden/implementation-decentralized";
import {
  GraffitiPlugin,
  useGraffiti,
  useGraffitiSession,
  useGraffitiDiscover,
} from "@graffiti-garden/wrapper-vue";

function setup() {
  // Initialize Graffiti (you'll need this later)
  const graffiti = useGraffiti();
  const session = useGraffitiSession();

  // Declare a signal for the message entered in the chat
  const myMessage = ref("");

  // Declare a signal representing the messages in the chat
  const messageObjects = ref([]);

  function sendMessage() {
    messageObjects.value.push({
      value: {
        content: myMessage.value,
        published: Date.now(),
      },
    });
  }

  return {
    myMessage,
    messageObjects,
    sendMessage,
  };
}

createApp({ template: "#template", setup })
  .use(GraffitiPlugin, {
    graffiti: new GraffitiLocal(),
    // graffiti: new GraffitiDecentralized(),
  })
  .mount("#app");
