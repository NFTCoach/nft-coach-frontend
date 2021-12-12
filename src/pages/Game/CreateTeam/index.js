import React from "react";
import styles from "./CreateTeam.module.scss";
import { ReactComponent as UserIcon } from "assets/icons/user/user.svg";
import Button from "components/Button";
import Input from "components/Input";
import { useGameFunctions } from "common/hooks/useGameFunctions";
import { useContractFunction } from "common/utils/contract/functions";
import { useRequest } from "common/hooks/useRequest";

const CreateTeam = () => {

    const { registerTeam } = useContractFunction();
    const registerTeamReq = useRequest(registerTeam);
    

    return (
        <div className={styles.container}>
            <h1>Create Team</h1>
            <p>Hey Coach! Planet needs you. Create your team and avatar.</p>
            <div className={styles["create-team--container"]}>
                <div className={styles["team-container"]}>
                    <div className={styles["image-container"]}>
                        <UserIcon />
                    </div>
                    <Button>Edit logo</Button>
                    <Input name="team_name">
                        Team Name
                    </Input>
                </div>
                <div className={styles["coach-container"]}>
                    <div className={styles["image-container"]}>
                        <UserIcon />
                    </div>
                    <Button>Edit avatar</Button>
                    <Input name="coach_name">
                        Coach Name
                    </Input>
                </div>
            </div>
            <Button size="large" loading={registerTeamReq.loading} onClick={() => {
                registerTeamReq.exec();
            }}>Create</Button>
        </div>
    );
}

export default CreateTeam;
