import { createApp, ref } from "vue";
import { GraffitiLocal } from "@graffiti-garden/implementation-local";
import { GraffitiDecentralized } from "@graffiti-garden/implementation-decentralized";
import {
  GraffitiPlugin,
  useGraffiti,
  useGraffitiSession,
  useGraffitiDiscover,
} from "@graffiti-garden/wrapper-vue";

import {reactive, computed} from "vue";

function setup() {
  // Initialize Graffiti (you'll need this later)
  const graffiti = useGraffiti();
  const session = useGraffitiSession();

  // Declare a signal for the message entered in the chat
  const myMessage = ref("");

  // Declare a signal representing the messages in the chat
  const { objects: messageObjects } = useGraffitiDiscover(
    [ `designftw-26-studio-1` ],
    {
      value: {
        required: [ 'content', 'published' ],
          properties: {
            content: { type: "string" },
            published: { type: "number" },
          },
      },
    },
    undefined, // If you wanted private messages, this is where you'd supply a "session"
      true // automatically poll for new messages
  );

  const sortedMessageObjects = computed(() => {
    return messageObjects.value.toSorted((a, b) => 
      b.value.published - a.value.published);
  })

  const isSending = ref(false);

  async function sendMessage() {
    isSending.value = true;
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    
    await graffiti.post(
      {
          value: {
            content: myMessage.value,
            published: Date.now(),
          },
          channels: [ `designftw-26-studio-1` ]
      },
      session.value,
    );

    myMessage.value = "";
    isSending.value = false;
  }

  return {
    myMessage,
    messageObjects,
    sortedMessageObjects,
    sendMessage,
    isSending
  };
}

createApp({ template: "#template", setup })
  .use(GraffitiPlugin, {
    // graffiti: new GraffitiLocal(),
    graffiti: new GraffitiDecentralized(),
  })
  .mount("#app");
