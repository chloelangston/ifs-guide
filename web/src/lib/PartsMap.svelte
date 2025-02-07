<script lang="ts">
    import { writable } from 'svelte/store';
  
    // Sample parts (for now, we can update this dynamically later)
    export let parts = writable([
      { name: "Sensitivity", color: "#F4C6D5", position: "stomach", side: "middle" }, // Soft pink for sensitivity
      { name: "Self-Esteem", color: "#BFD8B7", position: "stomach", side: "left" }, // White flower for self-esteem
      { name: "Fear", color: "#AFC7E7", position: "head", side: "right" }, // Gray fog for fear
      { name: "Sludge", color: "#D3D3D9", position: "head", side: "left" }, // Black sludge
      { name: "Protector", color: "#F8D3A5", position: "neck", side: "left" }, // Orange
    ]);
  
    // Define vertical positioning for body locations
    const partPositions = {
      head: "10%",
      neck: "20%",
      chest: "35%",
      stomach: "50%",
      legs: "80%",
    };

    const partSide = {
      left: "20%",
      middle: "45%",
      right: "70%",
    };
  </script>
  
  <style>
    .parts-map {
      width: 200px;
      height: 100%;
      background-color: #f0f0f0; /* Light background */
      border-right: 2px solid #ccc;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
  
    .part {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  </style>
  
  <div class="parts-map">
    {#each $parts as part}
      <div 
        class="part"
        style="background-color: {part.color}; top: {partPositions[part.position] || '50%'}; left: {partSide[part.side]};"
      >
        {part.name}
      </div>
    {/each}
  </div>
  