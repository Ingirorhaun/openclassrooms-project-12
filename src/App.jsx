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

function App() {
  const userId = 18;
  const [userData, setUserData] = useState();
  const [userActivity, setUserActivity] = useState(null);
  const [userAverageSessions, setUserAverageSessions] = useState();
  const [userPerformance, setUserPerformance] = useState();
  const userApi = new UserApi(userId, "http://localhost:3000");

  useEffect(() => {
    async function fetchUserData() {
      await userApi.getUserById().then((data) => setUserData(data));
      await userApi.getUserActivity().then((data) => setUserActivity(data));
      await userApi
        .getUserAverageSessions()
        .then((data) => setUserAverageSessions(data));
      await userApi
        .getUserPerformance()
        .then((data) => setUserPerformance(data));
    }
    async function preloadFont() {
      const font = new FontFace(
        "Roboto",
        "url('https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu72xKOzY.woff2') format('woff2')"
      );
      await font.load();
      document.fonts.add(font);
    }
    async function init() {
      await preloadFont();
      await fetchUserData();
    }
    init();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <SideNav />
        <section className="main-content">
          <h1>
            Bonjour <span>{userData?.userInfos.firstName}</span>
          </h1>
          <h3>Félicitation ! Vous avez explosé vos objectifs hier 👏</h3>
          <section className="charts">
            <div className="container">
              <div className="flex-col">
                <div className="left-top chart">
                  {userActivity && (
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
                  {userActivity && (
                    <LineChartComponent
                      chartData={userActivity.sessions}
                      options={{
                        title: "Activité quotidienne",
                        width: 258,
                        height: 263,
                      }}
                    />
                  )}
                  </div>
                  <div className="second chart"></div>
                  <div className="third chart"></div>
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
      </main>
    </div>
  );
}

export default App;
