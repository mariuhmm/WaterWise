import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import StationsTable from './components/StationsTable';
import IndustrialWastewaterTable from './components/IndustrialWastewaterTable';
import LakeWaterQualityTable from './components/LakeWaterQualityTable';
import StreamWaterQualityTable from './components/StreamWaterQualityTable';
import SectorSelection from './components/SectorSelection'


function App() {
  return (
    <Router>
      <div className="App">
        <h1>WaterWise</h1>
        <Routes>
          <Route path="/" element={<StationsTable />} />
          <Route path="/sector-selection" element={<SectorSelection />} />
          <Route path="/industrial-wastewater" element={<IndustrialWastewaterTable />} />
          <Route path="/industrial-wastewater/:sector" element={<IndustrialWastewaterTable />} />
          <Route path="/inland-lake-drinking-water-quality" element={<LakeWaterQualityTable />} />
          <Route path="/stream-water-quality" element={<StreamWaterQualityTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
