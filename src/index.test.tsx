import React, { useState } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { useSession as useSessionImpl } from "./use-session";
import { ProvideSession, hasSessionContext } from "./provider";

let container: any;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
});

type SessionData = {
    a: number;
    b: number;
    c: string;
    d?: boolean;
};

const useSession = useSessionImpl<SessionData>();

function TestComponent1() {
    const [mount, setMount] = useState<boolean>(true);
    const [{ a, b }, set] = useSession(["a", "b"]);

    return (
        <div>
            <p>
                <span id="a">{a}</span> + <span id="b">{b}</span> =
                <span id="result">{a + b}</span>
            </p>
            <button
                id="btn1"
                onClick={() => {
                    set("a", a + 1);
                    set("b", b + 1);
                }}
            />
            <button id="mount" onClick={() => setMount(!mount)} />
            {mount && <TestComponent2 />}
        </div>
    );
}

function TestComponent2() {
    const [{ c, d }, set] = useSession(["c", "d"]);

    return (
        <div>
            <p id="c">{c}</p>
            <p id="d">{d === true ? "true" : "false"}</p>
            <button
                id="btn2"
                onClick={() => {
                    set("c", String(Number(c) + 1));
                    set("d", true);
                }}
            />
        </div>
    );
}

function TestComponent3() {
    const [, set] = useSession(["c"]);

    return (
        <div>
            <button
                id="btn3"
                onClick={() => {
                    set("c", "TEST");
                    set("d", undefined);
                }}
            />
        </div>
    );
}

function ObserverComponent() {
    const [{ a, b, c, d }] = useSession(["b", "c", "a", "d"]);

    return (
        <div>
            <span id="o-a">{a}</span>
            <span id="o-b">{b}</span>
            <span id="o-c">{c}</span>
            <span id="o-d">{typeof d}</span>
        </div>
    );
}

const defaultData: SessionData = { a: 5, b: 10, c: "0" };
function TestApp({
    keepOnUnmount,
    context,
}: {
    keepOnUnmount?: boolean;
    context?: string;
}) {
    return (
        <ProvideSession
            data={defaultData}
            keepOnUnmount={keepOnUnmount}
            name={context}>
            <TestComponent1 />
            <TestComponent3 />
            <ObserverComponent />
        </ProvideSession>
    );
}

function testData(a: number, b: number, c: string, d?: boolean) {
    expect(Number(container.querySelector("#a").innerHTML)).toBe(a);
    expect(Number(container.querySelector("#b").innerHTML)).toBe(b);
    expect(container.querySelector("#c").innerHTML).toBe(c);
    expect(container.querySelector("#d").innerHTML).toBe(
        d === true ? "true" : "false",
    );

    expect(Number(container.querySelector("#o-a").innerHTML)).toBe(a);
    expect(Number(container.querySelector("#o-b").innerHTML)).toBe(b);
    expect(container.querySelector("#o-c").innerHTML).toBe(c);
    expect(container.querySelector("#o-d").innerHTML).toBe(typeof d);
}

it("can not use useSession hook without session provider", () => {
    expect(() => render(<TestComponent1 />, container)).toThrow();
    expect(() => render(<TestApp />, container)).not.toThrow();
});

it("data has the correct default values", () => {
    act(() => {
        render(<TestApp />, container);
    });
    testData(defaultData.a, defaultData.b, defaultData.c, defaultData.d);
});

it("can set session values", () => {
    act(() => {
        render(<TestApp />, container);
    });
    const btn1 = container.querySelector("#btn1");
    const btn2 = container.querySelector("#btn2");
    const btn3 = container.querySelector("#btn3");

    act(() => {
        btn1.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        btn2.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    testData(
        defaultData.a + 1,
        defaultData.b + 1,
        String(Number(defaultData.c) + 1),
        true,
    );

    act(() => {
        btn3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    testData(defaultData.a + 1, defaultData.b + 1, "TEST", defaultData.d);
});

it("can mount and dismount", () => {
    act(() => {
        render(<TestApp />, container);
    });
    const mount = container.querySelector("#mount");
    const btn3 = container.querySelector("#btn3");

    testData(defaultData.a, defaultData.b, defaultData.c);

    act(() => {
        mount.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(container.querySelector("#c")).toBeNull();

    act(() => {
        btn3.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        mount.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    testData(defaultData.a, defaultData.b, "TEST");
});

it("will clear context on dismount", () => {
    act(() => {
        render(<TestApp context="TEST-CONTEXT" />, container);
    });

    unmountComponentAtNode(container);

    expect(hasSessionContext("TEST-CONTEXT")).toBe(false);
});

it("can keep context on dismount", () => {
    act(() => {
        render(<TestApp context="TEST-CONTEXT" keepOnUnmount />, container);
    });

    unmountComponentAtNode(container);

    expect(hasSessionContext("TEST-CONTEXT")).toBe(true);
});
