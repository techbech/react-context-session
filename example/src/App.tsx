import React, { useEffect, useState } from "react";

import { useSession, ProvideSession } from "react-context-session";

type Test = {
    a: number;
    b: number;
    c: number;
};

export function Observer() {
    const [{ c }] = useSession<Test>()(["c"]);

    return (
        <div className={"parent"}>
            <div className={"card"}>
                <h3>Observer</h3>
                <p className={"last-render"}>
                    Last <u>render</u> at: {new Date().getTime()}
                </p>
                <div className={"row"}>
                    <div className={"states"}>
                        <p>
                            <span>C</span>
                            {c}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Child({ property }: { property: keyof Test }) {
    const [data, set] = useSession<Test>()([property]);
    const p = data[property];
    const [updatedAt, setUpdatedAt] = useState<Date>(new Date());

    useEffect(() => {
        setUpdatedAt(new Date());
    }, [p]);

    return (
        <div className={"card"}>
            <h3>{`Child (${property.toUpperCase()})`}</h3>
            <p className={"last-render"}>
                Last <u>render</u> at: {new Date().getTime()}
            </p>
            <p className={"last-effect"}>
                Last <u>effect</u> on <b>{property.toUpperCase()}</b> at:{" "}
                {updatedAt.getTime()}
            </p>
            <div className={"row"}>
                <div className={"states"}>
                    <p>
                        <span>{property.toUpperCase()}</span>
                        {p}
                    </p>
                </div>
                <div className={"buttons"}>
                    <button
                        onClick={() => {
                            set(property, p + 1);
                        }}>
                        {`Increment ${property.toUpperCase()}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function Parent() {
    const [{ a, b, c }, set] = useSession<Test>()(["a", "b", "c"]);
    const [mountChild, setMountChild] = useState<boolean>(true);

    return (
        <div className={"parent"}>
            <div className={"card"}>
                <h3>Parent</h3>
                <p className={"last-render"}>
                    Last <u>render</u> at: {new Date().getTime()}
                </p>
                <div className={"row"}>
                    <div className={"states"}>
                        <p>
                            <span>A</span>
                            {a}
                        </p>
                        <p>
                            <span>B</span>
                            {b}
                        </p>
                        <p>
                            <span>C</span>
                            {c}
                        </p>
                    </div>
                    <div className={"buttons"}>
                        <button
                            onClick={() => {
                                set("a", a + 1);
                            }}>
                            Increment A
                        </button>
                        <button
                            onClick={() => {
                                set("b", b + 1);
                            }}>
                            Increment B
                        </button>
                        <button
                            onClick={() => {
                                set("c", c + 1);
                            }}>
                            Increment C
                        </button>
                    </div>
                </div>

                <div className={"mount-dismount"}>
                    <button
                        onClick={() => {
                            setMountChild(!mountChild);
                        }}>
                        Mount/dismount child
                    </button>
                </div>
            </div>
            {mountChild && (
                <>
                    <Child property={"b"} />
                </>
            )}
        </div>
    );
}

export function App() {
    return (
        <div>
            <h1>react-context-session</h1>
            <code className={"code"}>
                {`type MySessionData = {
              a: number;
              b: number;
              c: number;
            };`}
            </code>
            <div className={"container"}>
                <div className={"context"}>
                    <ProvideSession<Test>
                        data={{ a: 0, b: 0, c: 0 }}
                        name={"app"}
                        onChange={async (data) => {
                            console.log("Save to storage", data);
                        }}>
                        <h2>
                            <u>App</u> context
                        </h2>
                        <Parent />
                        <Observer />
                    </ProvideSession>
                </div>
                <div className={"context"}>
                    <ProvideSession<Test>
                        data={{ a: 0, b: 0, c: 0 }}
                        name={"admin"}>
                        <h2>
                            <u>Admin</u> context
                        </h2>
                        <Parent />
                        <Observer />
                    </ProvideSession>
                </div>
            </div>
        </div>
    );
}

export function WithoutProvider() {
    return <Observer />;
}
