import React from "react";
import styles from "./CreateTeam.module.scss";

const CreateTeam = () => {
    return (
        <div className={styles.container}>
            <h1>Create Team</h1>
            <p>Hey Coach! Planet needs you. Create your team and avatar.</p>
            <div className={styles["create-team--container"]}>
                <div className={styles["team-container"]}></div>
                <div className={styles["coach-container"]}></div>
            </div>
        </div>
    );
}

export default CreateTeam;
