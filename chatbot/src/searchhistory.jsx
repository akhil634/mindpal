import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

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
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Search History</h2>
      {history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-6 py-3 text-left">Prompt</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Response</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="odd:bg-gray-100 even:bg-white">
                  <td className="border border-gray-300 px-6 py-3 break-words max-w-xl">{item.prompt}</td>
                  <td className="border border-gray-300 px-6 py-3 break-words max-w-2xl">{item.response}</td>
                  <td className="border border-gray-300 px-6 py-3 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No search history found.</p>
      )}
    </div>
  );
};

export default SearchHistory;
