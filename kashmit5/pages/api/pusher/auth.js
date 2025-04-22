import Pusher from "pusher";

// Initialize Pusher with correct environment variables
const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

export default function handler(req, res) {
  const { channel_name, socket_id } = req.body;
  console.log(
    "Received channel name:",
    channel_name,
    "and socket id:",
    socket_id
  );

  // Ensure req.user is populated (verify authentication method)
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(403).send("Unauthorized");
  }

  // Try to authenticate user with Pusher
  try {
    const auth = pusher.authenticate(socket_id, channel_name, {
      user_id: user_id, // The user's unique ID
      user_info: {
        name: req.user?.name, // Optional additional user info (if using presence channel)
        email: req.user?.email,
      },
    });

    res.send(auth); // Respond with Pusher auth data
  } catch (error) {
    console.error("Pusher authentication error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
