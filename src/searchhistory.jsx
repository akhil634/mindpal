import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./searchhistory.css";

const SearchHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        console.log("No userId provided. Skipping fetch.");
        return;
      }

      console.log("Fetching history for userId:", userId);

      const { data, error } = await supabase
        .from("search_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        console.log("Fetched history:", data);
        setHistory(data);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="search-history-container">
      <h2 className="search-history-title">Search History</h2>
      {history.length > 0 ? (
        <div className="search-history-table-container">
          <table className="search-history-table">
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
                  <td className="prompt-cell">{item.prompt}</td>
                  <td className="response-cell">{item.response}</td>
                  <td className="time-cell">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-message">No search history found.</p>
      )}
    </div>
  );
};

export default SearchHistory;
