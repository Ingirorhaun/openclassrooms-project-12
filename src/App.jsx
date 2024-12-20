import { useEffect, useState } from "react";
import { Header } from "./components/header";
import { SideNav } from "./components/sidenav";
import { UserApi } from "./api/api";
import { IconCalories } from "./components/icons/icon-calories";
import { IconProteins } from "./components/icons/icon-proteins";
import { IconCarbohydrates } from "./components/icons/icon-carbohydrates";
import { IconLipids } from "./components/icons/icon-lipids";
import BarChartComponent from "./charts/BarChart";
import LineChartComponent from "./charts/LineChart";
import RadarChartComponent from "./charts/RadarChart";
import ProgressChartComponent from "./charts/ProgressChart";

function App() {
  const userId = 12;
  const [userData, setUserData] = useState();
  const [userActivity, setUserActivity] = useState(null);
  const [userAverageSessions, setUserAverageSessions] = useState(null);
  const [userPerformance, setUserPerformance] = useState();
  const [error, setError] = useState(null);
  const userApi = new UserApi(userId, "http://localhost:3000", false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const [userData, activityData, sessionsData, performanceData] =
          await Promise.all([
            userApi.getUserById(),
            userApi.getUserActivity(),
            userApi.getUserAverageSessions(),
            userApi.getUserPerformance(),
          ]);
        setUserData(userData);
        setUserActivity(activityData);
        setUserAverageSessions(sessionsData);
        setUserPerformance(performanceData);
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
      }
    }
    async function init() {
      await fetchUserData();
    }
    init();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <SideNav />
        {error ? (
          <div className="error-message">Erreur <span>{error.message}</span></div>
        ) : (
          <section className="main-content">
            <h1>
              Bonjour <span>{userData?.userInfos.firstName}</span>
            </h1>
            <h3>Félicitation ! Vous avez explosé vos objectifs hier 👏</h3>
            <section className="charts">
              <div className="container">
                <div className="flex-col">
                  <div className="left-top chart">
                    {userActivity?.sessions && (
                      <BarChartComponent
                        chartData={userActivity.sessions}
                        options={{
                          title: "Activité quotidienne",
                          width: 835,
                          height: 320,
                        }}
                      />
                    )}
                  </div>
                  <div className="left-bottom">
                    <div className="first chart">
                      {userAverageSessions?.sessions && (
                        <LineChartComponent
                          chartData={userAverageSessions.sessions}
                          options={{
                            title: "Durée moyenne des sessions",
                            width: 258,
                            height: 263,
                          }}
                        />
                      )}
                    </div>
                    <div className="second chart">
                      {userPerformance && (
                        <RadarChartComponent
                          chartData={userPerformance}
                          options={{
                            width: 258,
                            height: 263,
                          }}
                        />
                      )}
                    </div>
                    <div className="third chart">
                      {userData?.todayScore && (
                        <ProgressChartComponent
                          chartData={userData.todayScore}
                          options={{
                            title: "Score",
                            width: 258,
                            height: 263,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-col right-col">
                  <div className="calories chart">
                    <IconCalories />
                    <div>
                      {userData?.keyData.calorieCount}kCal
                      <br />
                      <span>Calories</span>
                    </div>
                  </div>
                  <div className="proteins chart">
                    <IconProteins />
                    <div>
                      {userData?.keyData.proteinCount}g<br />
                      <span>Proteines</span>
                    </div>
                  </div>
                  <div className="carbohydrates chart">
                    <IconCarbohydrates />
                    <div>
                      {userData?.keyData.carbohydrateCount}g<br />
                      <span>Glucides</span>
                    </div>
                  </div>
                  <div className="lipids chart">
                    <IconLipids />
                    <div>
                      {userData?.keyData.lipidCount}g<br />
                      <span>Lipides</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
