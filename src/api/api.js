
export class UserApi {
    /**
     * @param {Number} userId
     * @param {String} url
     * @param {Boolean} useMockedData
     */
    constructor(userId, url, useMockedData) {
        this.url = url;
        this.userId = userId;
        this.useMockedData = useMockedData;
    }
    /**
     * @typedef {Object} UserData
     * @property {Number} id
     * @property {Object} userInfos
     * @property {String} userInfos.firstName
     * @property {String} userInfos.lastName
     * @property {Number} userInfos.age
     * @property {Number} todayScore
     * @property {Object} keyData
     * @property {Number} keyData.calorieCount
     * @property {Number} keyData.proteinCount
     * @property {Number} keyData.carbohydrateCount
     * @property {Number} keyData.lipidCount
     */
    /**
     * 
     * @returns {UserData}
     */
    async getUserById() {
        // Use mocked data
        if (this.useMockedData) {
            const { USER_MAIN_DATA } = await import("./mock.js");
            const userMainData = USER_MAIN_DATA.find((user) => user.id === this.userId);
            if (userMainData.score) {
                userMainData.todayScore = userMainData.score;
            }
            return userMainData;
        }
        // Use API data
        try {
            const response = await fetch(`${this.url}/user/${this.userId}`);
            if (!response.ok) {
                throw new UserApiError(`Impossible de récupérer les données utilisateur: ${response.status}`, response);
            }
            const data = await response.json();
            if (data.data?.score) {
                data.data.todayScore = data.data.score;
            }
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Erreur lors de la récupération des données utilisateur', error);
        }
    }
    /**
     * @typedef {Object} UserActivity
     * @property {Number} userId
     * @property {Object} sessions
     * @property {Array} sessions.sessions
     * @property {Number} sessions.sessions.day
     * @property {Number} sessions.sessions.kilogram
     * @property {Number} sessions.sessions.calories
     */
    /**
     *
     * @returns {UserActivity}
     */
    async getUserActivity() {
        // Use mocked data
        if (this.useMockedData) {
            const { USER_ACTIVITY } = await import("./mock.js");
            return USER_ACTIVITY.find((user) => user.userId === this.userId);
        }
        // Use API data
        try {
            const response = await fetch(`${this.url}/user/${this.userId}/activity`);
            if (!response.ok) {
                throw new UserApiError(`Impossible de récupérer les données de l'activité: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Erreur lors de la récupération des données de l\'activité', error);
        }
    }
    /**
     * @typedef {Object} UserAverageSessions
     * @property {Number} userId
     * @property {Object} sessions
     * @property {Array} sessions.sessions
     * @property {Number} sessions.sessions.day
     * @property {Number} sessions.sessions.sessionLength
     */
    /**
     *
     * @returns {UserAverageSessions}
     */
    async getUserAverageSessions() {
        // Use mocked data
        if (this.useMockedData) {
            const { USER_AVERAGE_SESSIONS } = await import("./mock.js");
            return USER_AVERAGE_SESSIONS.find((user) => user.userId === this.userId);
        }
        // Use API data
        try {
            const response = await fetch(`${this.url}/user/${this.userId}/average-sessions`);
            if (!response.ok) {
                throw new UserApiError(`Impossible de récupérer les données des sessions: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Erreur lors de la récupération des données des sessions', error);
        }
    }

    /**
     * @typedef {Object} UserPerformance
     * @property {Number} userId
     * @property {Object} kind
     * @property {Array} data
     * @property {Number} data.value
     * @property {Number} data.kind
    */
    /**
     *
     * @returns {UserPerformance}
     */
    async getUserPerformance() {
        // Use mocked data
        if (this.useMockedData) {
            const { USER_PERFORMANCE } = await import("./mock.js");
            return USER_PERFORMANCE.find((user) => user.userId === this.userId);
        }
        // Use API data
        try {
            const response = await fetch(`${this.url}/user/${this.userId}/performance`);
            if (!response.ok) {
                throw new UserApiError(`Impossible de récupérer les données de performances: ${response.status}`, response);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof UserApiError) {
                throw error;
            }
            throw new UserApiError('Erreur lors de la récupération des données de performances', error);
        }
    }
}

class UserApiError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'UserApiError';
        this.cause = cause;
    }
}
