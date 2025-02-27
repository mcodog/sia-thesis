import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useReactToPrint } from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axiosInstance from "../Utils/axiosInstance";

const Print = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [counselingData, setCounselingData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalSubmissions: 0,
    uniqueUsers: 0,
    repeatedSubmissions: 0,
    averageAge: 0,
    genderDistribution: {},
  });
  const printRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get("/analysis/");
      if (res.status === 200) {
        const analyses = res.data;
        processAnalysisData(analyses);
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalysisData = (analyses) => {
    // Count unique users
    const uniqueUserIds = new Set(analyses.map((entry) => entry.user));
    const uniqueUsersCount = uniqueUserIds.size;
    const totalSubmissions = analyses.length;
    const repeatedSubmissions = totalSubmissions - uniqueUsersCount;

    // Prepare user data for the user table
    const processedUserData = [];
    const userMap = new Map();
    const genderCounts = {};
    let totalAge = 0;
    let ageCount = 0;

    analyses.forEach((entry) => {
      // Calculate averages and counts for the user if not already processed
      if (!userMap.has(entry.user)) {
        userMap.set(entry.user, true);

        const userData = {
          id: entry.user,
          userId: entry.user,
          gender: entry.gender || "Not specified",
          age: entry.age || "Not specified",
        };

        // Count gender
        if (entry.gender) {
          genderCounts[entry.gender] = (genderCounts[entry.gender] || 0) + 1;
        }

        // Add to age calculation
        if (entry.age) {
          totalAge += entry.age;
          ageCount++;
        }

        processedUserData.push(userData);
      }
    });

    // Prepare counseling data for the counseling table
    const processedCounselingData = analyses.map((entry, index) => {
      const submissionDate = new Date(
        entry.created_at || entry.timestamp || Date.now()
      );

      // Extract all counseling types and their values
      const counselingEntries = {};
      Object.entries(entry.analysis_result).forEach(([name, value]) => {
        counselingEntries[name] = (value * 100).toFixed(1) + "%";
      });

      return {
        id: index,
        userId: entry.user,
        date: submissionDate.toLocaleDateString(),
        ...counselingEntries,
      };
    });

    // Calculate average age
    const averageAge = ageCount > 0 ? (totalAge / ageCount).toFixed(1) : "N/A";

    setCounselingData(processedCounselingData);
    setUserData(processedUserData);
    setSummaryData({
      totalSubmissions,
      uniqueUsers: uniqueUsersCount,
      repeatedSubmissions,
      averageAge,
      genderDistribution: genderCounts,
    });
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Counseling Analysis Report",
    onAfterPrint: () => console.log("Print completed"),
  });

  // Get all unique counseling types for columns
  const getCounselingColumns = () => {
    if (counselingData.length === 0) return [];

    // Get all keys from the first entry that aren't id, userId or date
    const allKeys = Object.keys(counselingData[0]);
    const counselingTypes = allKeys.filter(
      (key) => !["id", "userId", "date"].includes(key)
    );

    const baseColumns = [
      { field: "userId", headerName: "User ID", width: 120 },
      { field: "date", headerName: "Date", width: 120 },
    ];

    const counselingColumns = counselingTypes.map((type) => ({
      field: type,
      headerName: type,
      width: 150,
    }));

    return [...baseColumns, ...counselingColumns];
  };

  const userColumns = [
    { field: "userId", headerName: "User ID", width: 120 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "age", headerName: "Age", width: 100 },
  ];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Counseling Analysis Report</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ mr: 2 }}
          >
            Print Report
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePrint}
          >
            Save as PDF
          </Button>
        </Box>
      </Box>

      <div ref={printRef}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Summary Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Total Submissions:</strong>{" "}
                {summaryData.totalSubmissions}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Unique Users:</strong> {summaryData.uniqueUsers}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Repeated Submissions:</strong>{" "}
                {summaryData.repeatedSubmissions}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Average Age:</strong> {summaryData.averageAge}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Gender Distribution
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(summaryData.genderDistribution).map(
              ([gender, count]) => (
                <Grid item key={gender} xs={6} sm={4} md={3}>
                  <Typography variant="body2">
                    <strong>{gender}:</strong> {count} (
                    {((count / summaryData.uniqueUsers) * 100).toFixed(1)}%)
                  </Typography>
                </Grid>
              )
            )}
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            User Demographics
          </Typography>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={userData}
              columns={userColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
            />
          </div>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Counseling Analysis Details
          </Typography>
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={counselingData}
              columns={getCounselingColumns()}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
            />
          </div>
        </Paper>
      </div>
    </Box>
  );
};

export default Print;
