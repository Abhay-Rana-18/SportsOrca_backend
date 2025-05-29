const express = require("express");
const axios = require("axios");
const cors = require("cors");
// require('dotenv').config();

const app = express();
const PORT = 5000;
app.use(cors());
// app.use(
//   cors({
//     origin: [
//       "https://shimmering-biscochitos-41971d.netlify.app/",
//       "https://sports-orca-frontend.vercel.app/",
//       "http://localhost:5173/"
//     ],
//   })
// );

const API_KEY = "828915a2f64b43109e45076c5fd9db4c";

app.get("/api/upcoming-matches", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.football-data.org/v4/matches?status=SCHEDULED",
      {
        headers: {
          "X-Auth-Token": API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch matches");
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.get("/api/live-matches", async (req, res) => {
  const options = {
    method: "GET",
    url: "https://sofasport.p.rapidapi.com/v1/events/schedule/live",
    params: { sport_id: "1" }, // 1 is for football
    headers: {
      "x-rapidapi-key": "09fe7ec198mshac14012afe6e3a7p13bc68jsn32df356a8f5b",
      "x-rapidapi-host": "sofasport.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const matches = response.data.data;

    const formattedMatches = matches.map((match) => ({
      id: match.id,
      tournament: match.tournament?.name,
      homeTeam: match.homeTeam?.name,
      awayTeam: match.awayTeam?.name,
      startTime: new Date(match.startTimestamp * 1000).toLocaleString(),
      score: `${match.homeScore?.display ?? 0} - ${
        match.awayScore?.display ?? 0
      }`,
      status: match.status?.description,
    }));

    res.json(formattedMatches);
  } catch (error) {
    console.error("Error fetching matches:", error.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.get("/api/competitions", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.football-data.org/v4/competitions",
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
});

app.get("/api/teams/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/teams`,
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

app.get("/api/standings/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${code}/standings`,
      {
        headers: { "X-Auth-Token": API_KEY },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch standings" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
