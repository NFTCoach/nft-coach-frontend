import useAccount from "common/hooks/useAccount";
import React, { useEffect } from "react";

export default function TrainingMatch() {

    const { getIsSignedIn } = useAccount({
        directSignIn: true
    });

    useEffect(() => {
        getIsSignedIn();
    }, []);

    return null;
}