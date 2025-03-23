export async function addScore(userId: string, points: number) {
    const res = await fetch("https://truhackbackend.onrender.com/add-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        points,
      }),
    })
  
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "Failed to add score")
    }
  
    return res.json()
  }
  