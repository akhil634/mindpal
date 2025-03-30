import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const SearchHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        console.log("No userId provided. Skipping fetch."); // 🔴 Debug log
        return;
      }

      console.log("Fetching history for userId:", userId); // ✅ Debug log

      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error); // 🔴 Debug log
      } else {
        console.log("Fetched history:", data); // ✅ Debug log
        setHistory(data);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div>
      <h2>Search History</h2>
      {history.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Prompt</th>
              <th>Response</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.prompt}</td>
                <td>{item.response.substring(0, 100)}...</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No search history found.</p>
      )}
    </div>
  );
};

export default SearchHistory;
