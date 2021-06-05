/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

export default function DocumentScreen() {
  const [categories, setCategories] = useState([]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg border flex items-center space-x-12">
      <div>
        <div className="text-xl font-medium text-black">ChitChat</div>
        <p className="text-gray-500">You have a new message!</p>
      </div>
    </div>
  );
}
