import { lobbyClient, playerClient, snapshotClient, voteClient } from './api/index';

async function testApis() {
  console.log("Starting API tests...\n");

  // 1. Create Lobby
  try {
    console.log("1. Creating Lobby...");
    // Assuming LobbyClient has a method createLobby() which performs a POST to create a lobby.
    const createdLobby = await lobbyClient.createLobby();
    console.log("Created Lobby:", createdLobby, "\n");
  } catch (error) {
    console.error("Error creating lobby:", error, "\n");
  }

  // 2. Get Lobby
  try {
    console.log("2. Getting Lobby...");
    // Assuming LobbyClient has a method getLobby() to retrieve current lobby info.
    const lobby = await lobbyClient.getLobby();
    console.log("Lobby Data:", lobby, "\n");
  } catch (error) {
    console.error("Error getting lobby:", error, "\n");
  }

  // 3. Start Lobby
  try {
    console.log("3. Starting Lobby...");
    // Assuming LobbyClient has a method startLobby() which triggers the lobby to start.
    const startedLobby = await lobbyClient.startLobby();
    console.log("Lobby Started:", startedLobby, "\n");
  } catch (error) {
    console.error("Error starting lobby:", error, "\n");
  }

  // 4. Advance Phase (with advanceBy parameter)
  try {
    console.log("4. Advancing Phase by 1...");
    // Assuming LobbyClient has a method advancePhase(advanceBy: number)
    const advancedLobby = await lobbyClient.advancePhase();
    console.log("Advanced Lobby:", advancedLobby, "\n");
  } catch (error) {
    console.error("Error advancing phase:", error, "\n");
  }

  // 5. Add a Player
  try {
    console.log("5. Adding a Player...");
    // Assuming PlayerClient has a method addPlayer() which accepts player data.
    const newPlayer = await playerClient.addPlayer({ name: "John Doe", gameClassName: "Russian" });
    console.log("Added Player:", newPlayer, "\n");
  } catch (error) {
    console.error("Error adding player:", error, "\n");
  }

  // 6. Get All Players
  try {
    console.log("6. Getting All Players...");
    // Assuming PlayerClient exposes getPlayers() to fetch all players.
    const players = await playerClient.getPlayers();
    console.log("Players List:", players, "\n");
  } catch (error) {
    console.error("Error getting players:", error, "\n");
  }

  // 7. Get a Single Player
  try {
    console.log("7. Getting a Single Player...");
    // Assuming PlayerClient has getPlayer() which takes a player name or identifier.
    const player = await playerClient.getPlayer("John Doe");
    console.log("Player Data:", player, "\n");
  } catch (error) {
    console.error("Error getting player:", error, "\n");
  }

  // 8. Add a Vote
  try {
    console.log("8. Adding a Vote...");
    // Assuming VoteClient has addVote() accepting vote details.
    const vote = await voteClient.addVote({ byPlayer: "John Doe", binary: true, forPlayer: "John Doe" });
    console.log("Vote Added:", vote, "\n");
  } catch (error) {
    console.error("Error adding vote:", error, "\n");
  }

  // 9. Get All Votes
  try {
    console.log("9. Getting All Votes...");
    // Assuming VoteClient offers getVotes() to get all votes.
    const votes = await voteClient.getVotes();
    console.log("Votes List:", votes, "\n");
  } catch (error) {
    console.error("Error getting votes:", error, "\n");
  }

  // 10. Get a Vote
  try {
    console.log("10. Getting a Vote...");
    // Assuming VoteClient has getVote() which takes an identifier like player name.
    const voteDetails = await voteClient.getVote("John Doe");
    console.log("Vote Details:", voteDetails, "\n");
  } catch (error) {
    console.error("Error getting vote:", error, "\n");
  }

  // 11. Get Snapshot
  try {
    console.log("11. Getting Snapshot...");
    // Assuming SnapshotClient exposes getSnapshot() to retrieve game state details.
    const snapshot = await snapshotClient.getSnapshot();
    console.log("Snapshot Data:", snapshot, "\n");
  } catch (error) {
    console.error("Error getting snapshot:", error, "\n");
  }
}

testApis().catch((error) => {
  console.error("Unexpected error during API tests:", error);
});