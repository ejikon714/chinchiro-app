const dice = [
    document.querySelector("#dice1"),
    document.querySelector("#dice2"),
    document.querySelector("#dice3")
];

const rollButton =
    document.querySelector("#rollButton");

const result =
    document.querySelector("#result");

const strengthSelect =
    document.querySelector("#strength");

const themeSelect =
    document.querySelector("#theme");


/* ========================================
   サイコロの目の位置
======================================== */

const positions = {

    1: [
        [2, 2]
    ],

    2: [
        [1, 1],
        [3, 3]
    ],

    3: [
        [1, 1],
        [2, 2],
        [3, 3]
    ],

    4: [
        [1, 1],
        [1, 3],
        [3, 1],
        [3, 3]
    ],

    5: [
        [1, 1],
        [1, 3],
        [2, 2],
        [3, 1],
        [3, 3]
    ],

    6: [
        [1, 1],
        [1, 3],
        [2, 1],
        [2, 3],
        [3, 1],
        [3, 3]
    ]

};


/* ========================================
   サイコロの6面を作る
======================================== */

function createDice(die) {

    const faces = [
        "front",
        "back",
        "right",
        "left",
        "top",
        "bottom"
    ];

    faces.forEach(name => {

        const face =
            document.createElement("div");

        face.className =
            "face " + name;

        die.appendChild(face);

    });

}


/* ========================================
   面に目を描く
======================================== */

function showFace(face, number) {

    face.innerHTML = "";

    positions[number].forEach(pos => {

        const dot =
            document.createElement("span");

        dot.className = "dot";

        dot.style.gridRow =
            pos[0];

        dot.style.gridColumn =
            pos[1];

        face.appendChild(dot);

    });

}


/* ========================================
   サイコロの目を設定
======================================== */

function showDice(die, number) {

    const opposite = {

        1: 6,
        2: 5,
        3: 4,
        4: 3,
        5: 2,
        6: 1

    };


    const front =
        die.querySelector(".front");

    const back =
        die.querySelector(".back");

    const right =
        die.querySelector(".right");

    const left =
        die.querySelector(".left");

    const top =
        die.querySelector(".top");

    const bottom =
        die.querySelector(".bottom");


    showFace(front, number);

    showFace(back, opposite[number]);

    showFace(right, number);

    showFace(left, opposite[number]);

    showFace(top, number);

    showFace(bottom, opposite[number]);

}


/* ========================================
   初期状態
======================================== */

dice.forEach(die => {

    createDice(die);

    showDice(die, 1);

});


/* ========================================
   役判定
======================================== */

function checkRole(numbers) {

    const sorted =
        [...numbers].sort(
            (a, b) => a - b
        );


    const [a, b, c] =
        sorted;


    /* ピンゾロ */

    if (
        a === 1 &&
        b === 1 &&
        c === 1
    ) {

        return "ピンゾロ";

    }


    /* アラシ */

    if (
        a === b &&
        b === c
    ) {

        return "アラシ";

    }


    /* ヒフミ */

    if (
        a === 1 &&
        b === 2 &&
        c === 3
    ) {

        return "ヒフミ";

    }


    /* シゴロ */

    if (
        a === 4 &&
        b === 5 &&
        c === 6
    ) {

        return "シゴロ";

    }


    /* ペア */

    if (
        a === b &&
        b !== c
    ) {

        return c + "の目";

    }


    if (
        a === c &&
        a !== b
    ) {

        return b + "の目";

    }


    if (
        b === c &&
        a !== b
    ) {

        return a + "の目";

    }


    return "目なし";

}


/* ========================================
   ランダム
======================================== */

function random(min, max) {

    return Math.random()
        * (max - min)
        + min;

}


/* ========================================
   なめらかな減速
======================================== */

function easeOutQuint(t) {

    return 1 -
        Math.pow(
            1 - t,
            5
        );

}


/* ========================================
   振る強さ
======================================== */

function getStrength() {

    const strength =
        strengthSelect.value;


    if (strength === "weak") {

        return {

            duration: 2300,

            minX: 4,
            maxX: 6,

            minY: 4,
            maxY: 7,

            minZ: 2,
            maxZ: 4

        };

    }


    if (strength === "strong") {

        return {

            duration: 1900,

            minX: 10,
            maxX: 14,

            minY: 11,
            maxY: 16,

            minZ: 7,
            maxZ: 11

        };

    }


    return {

        duration: 2050,

        minX: 8,
        maxX: 11,

        minY: 8,
        maxY: 12,

        minZ: 5,
        maxZ: 8

    };

}


/* ========================================
   効果音
   Web Audio API
======================================== */

let audioContext = null;


function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    return audioContext;

}


/* サイコロが転がる音 */

function playRollSound() {

    try {

        const ctx =
            getAudioContext();


        if (
            ctx.state ===
            "suspended"
        ) {

            ctx.resume();

        }


        const start =
            ctx.currentTime;


        for (
            let i = 0;
            i < 14;
            i++
        ) {

            const oscillator =
                ctx.createOscillator();

            const gain =
                ctx.createGain();


            oscillator.type =
                "square";


            oscillator.frequency.value =
                90 +
                Math.random() * 70;


            gain.gain.setValueAtTime(
                0.0001,
                start + i * 0.075
            );


            gain.gain.exponentialRampToValueAtTime(
                0.045,
                start + i * 0.075 + 0.008
            );


            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + i * 0.075 + 0.055
            );


            oscillator.connect(gain);

            gain.connect(ctx.destination);


            oscillator.start(
                start + i * 0.075
            );


            oscillator.stop(
                start + i * 0.075 + 0.06
            );

        }

    } catch (error) {

        console.log(
            "効果音を再生できませんでした"
        );

    }

}


/* 止まった音 */

function playStopSound() {

    try {

        const ctx =
            getAudioContext();


        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            150,
            ctx.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            70,
            ctx.currentTime + 0.12
        );


        gain.gain.setValueAtTime(
            0.0001,
            ctx.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.15,
            ctx.currentTime + 0.01
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + 0.15
        );


        oscillator.connect(gain);

        gain.connect(ctx.destination);


        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.16
        );

    } catch (error) {

        console.log(
            "効果音を再生できませんでした"
        );

    }

}


/* ========================================
   役ごとの特殊音
======================================== */

function playRoleSound(role) {

    try {

        const ctx =
            getAudioContext();


        if (
            ctx.state ===
            "suspended"
        ) {

            ctx.resume();

        }


        let frequencies;


        if (
            role === "ピンゾロ"
        ) {

            frequencies =
                [523, 659, 784, 1046];

        } else if (
            role === "アラシ"
        ) {

            frequencies =
                [180, 240, 320];

        } else if (
            role === "ヒフミ"
        ) {

            frequencies =
                [300, 220];

        } else if (
            role === "シゴロ"
        ) {

            frequencies =
                [392, 494, 587, 784];

        } else {

            return;

        }


        frequencies.forEach(
            (frequency, index) => {

                const oscillator =
                    ctx.createOscillator();

                const gain =
                    ctx.createGain();


                oscillator.type =
                    "sine";


                oscillator.frequency.value =
                    frequency;


                const time =
                    ctx.currentTime +
                    index * 0.1;


                gain.gain.setValueAtTime(
                    0.0001,
                    time
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.12,
                    time + 0.015
                );


                gain.gain.exponentialRampToValueAtTime(
                    0.0001,
                    time + 0.25
                );


                oscillator.connect(gain);

                gain.connect(ctx.destination);


                oscillator.start(time);

                oscillator.stop(
                    time + 0.26
                );

            }
        );

    } catch (error) {

        console.log(
            "役の効果音を再生できませんでした"
        );

    }

}


/* ========================================
   役の特殊演出
======================================== */

function playRoleEffect(role) {

    result.className = "";


    /* アニメーションを再スタート */

    void result.offsetWidth;


    if (
        role === "ピンゾロ"
    ) {

        result.classList.add(
            "role-pin"
        );

    } else if (
        role === "アラシ"
    ) {

        result.classList.add(
            "role-arashi"
        );

    } else if (
        role === "ヒフミ"
    ) {

        result.classList.add(
            "role-hifumi"
        );

    } else if (
        role === "シゴロ"
    ) {

        result.classList.add(
            "role-shigoro"
        );

    } else if (
        role === "目なし"
    ) {

        result.classList.add(
            "role-none"
        );

    } else {

        result.classList.add(
            "role-eye"
        );

    }


    playRoleSound(role);

}


/* ========================================
   テーマ変更
======================================== */

function changeTheme(theme) {

    document.body.classList.remove(
        "theme-neon",
        "theme-japan",
        "theme-vip"
    );


    if (
        theme === "neon"
    ) {

        document.body.classList.add(
            "theme-neon"
        );

    }


    if (
        theme === "japan"
    ) {

        document.body.classList.add(
            "theme-japan"
        );

    }


    if (
        theme === "vip"
    ) {

        document.body.classList.add(
            "theme-vip"
        );

    }

}


/* テーマ変更 */

themeSelect.addEventListener(
    "change",
    () => {

        changeTheme(
            themeSelect.value
        );

    }
);


/* ========================================
   サイコロを転がす
======================================== */

function animateDice(
    die,
    index,
    finalNumber
) {

    return new Promise(resolve => {

        const scene =
            die.parentElement;


        const setting =
            getStrength();


        const duration =
            setting.duration;


        const startTime =
            performance.now();


        /* 回転量 */

        const turnsX =
            random(
                setting.minX,
                setting.maxX
            );


        const turnsY =
            random(
                setting.minY,
                setting.maxY
            );


        const turnsZ =
            random(
                setting.minZ,
                setting.maxZ
            );


        const directionX =
            Math.random() > 0.5
                ? 1
                : -1;


        const directionY =
            Math.random() > 0.5
                ? 1
                : -1;


        const directionZ =
            Math.random() > 0.5
                ? 1
                : -1;


        const spinX =
            turnsX *
            360 *
            directionX;


        const spinY =
            turnsY *
            360 *
            directionY;


        const spinZ =
            turnsZ *
            360 *
            directionZ;


        /* スタート位置 */

        const startX =
            random(-20, 20);


        const startZ =
            random(-15, 15);


        /* 停止位置 */

        const endPositions = [
            -100,
            0,
            100
        ];


        const endX =
            endPositions[index];


        const endZ =
            random(-5, 5);


        /* 上から落ちてくる */

        const startY =
            -130;


        function frame(now) {

            let t =
                (now - startTime)
                / duration;


            if (t < 0) {
                t = 0;
            }


            if (t > 1) {
                t = 1;
            }


            const eased =
                easeOutQuint(t);


            /* 横移動 */

            const x =
                startX +
                (endX - startX)
                * eased;


            /* 縦移動 */

            let y =
                startY +
                Math.abs(
                    Math.sin(
                        t * Math.PI
                    )
                ) * -35
                +
                130 * eased;


            /* 着地 */

            if (t > 0.78) {

                const settle =
                    (t - 0.78)
                    / 0.22;


                const smooth =
                    easeOutQuint(
                        settle
                    );


                y *=
                    1 - smooth;

            }


            /* 奥行き */

            const z =
                startZ +
                (endZ - startZ)
                * eased;


            /* 回転 */

            let rx =
                spinX * eased;


            let ry =
                spinY * eased;


            let rz =
                spinZ * eased;


            /* 停止直前の揺れ */

            let extraX = 0;
            let extraY = 0;
            let extraZ = 0;


            if (t > 0.82) {

                const settle =
                    (t - 0.82)
                    / 0.18;


                const strength =
                    Math.pow(
                        1 - settle,
                        2
                    );


                extraX =
                    Math.sin(
                        settle *
                        Math.PI *
                        2
                    )
                    *
                    0.6
                    *
                    strength;


                extraY =
                    Math.sin(
                        settle *
                        Math.PI *
                        2.2
                    )
                    *
                    0.5
                    *
                    strength;


                extraZ =
                    Math.sin(
                        settle *
                        Math.PI *
                        1.7
                    )
                    *
                    0.4
                    *
                    strength;

            }


            /* 最後に正面へ */

            if (t > 0.94) {

                const finalProgress =
                    (t - 0.94)
                    / 0.06;


                const finalEase =
                    easeOutQuint(
                        finalProgress
                    );


                rx =
                    rx *
                    (1 - finalEase);


                ry =
                    ry *
                    (1 - finalEase);


                rz =
                    rz *
                    (1 - finalEase);

            }


            scene.style.transform =

                `translate3d(
                    ${x}px,
                    ${y}px,
                    ${z}px
                )
                rotateX(
                    ${rx + extraX}deg
                )
                rotateY(
                    ${ry + extraY}deg
                )
                rotateZ(
                    ${rz + extraZ}deg
                )`;


            if (t < 1) {

                requestAnimationFrame(
                    frame
                );

            } else {

                scene.style.transform =

                    `translate3d(
                        ${endX}px,
                        0px,
                        ${endZ}px
                    )
                    rotateX(0deg)
                    rotateY(0deg)
                    rotateZ(0deg)`;


                resolve();

            }

        }


        requestAnimationFrame(frame);

    });

}


/* ========================================
   ションベン
======================================== */

function animateShonben(die) {

    return new Promise(resolve => {

        const scene =
            die.parentElement;


        const start =
            performance.now();


        const duration =
            1100;


        function frame(now) {

            let t =
                (now - start)
                / duration;


            if (t > 1) {

                t = 1;

            }


            const eased =
                easeOutQuint(t);


            const x =
                10 +
                300 * eased;


            const y =
                -20 +
                110 * eased;


            const z =
                10 +
                70 * eased;


            const rx =
                1000 * eased;


            const ry =
                1300 * eased;


            const rz =
                750 * eased;


            scene.style.transform =

                `translate3d(
                    ${x}px,
                    ${y}px,
                    ${z}px
                )
                rotateX(${rx}deg)
                rotateY(${ry}deg)
                rotateZ(${rz}deg)`;


            if (t < 1) {

                requestAnimationFrame(
                    frame
                );

            } else {

                resolve();

            }

        }


        requestAnimationFrame(frame);

    });

}


/* ========================================
   役ごとの結果表示
======================================== */

function showRole(role) {

    result.textContent =
        "役：" + role;


    playRoleEffect(role);

}


/* ========================================
   サイコロを振る
======================================== */

rollButton.addEventListener(
    "click",
    async () => {

        rollButton.disabled =
            true;


        result.className = "";


        result.textContent =
            "役：サイコロを振っています…";


        /* 効果音 */

        playRollSound();


        /* =================================
           15分の1でションベン
        ================================= */

        const isShonben =
            Math.floor(
                Math.random() * 15
            ) === 0;


        /* =================================
           出る目を決定
        ================================= */

        const numbers =
            dice.map(() => {

                return Math.floor(
                    Math.random() * 6
                ) + 1;

            });


        /* =================================
           3個を同時に転がす
        ================================= */

        await Promise.all(

            dice.map(
                (die, index) => {

                    return animateDice(
                        die,
                        index,
                        numbers[index]
                    );

                }
            )

        );


        /* 停止音 */

        playStopSound();


        /* =================================
           ションベン
        ================================= */

        if (isShonben) {

            const randomIndex =
                Math.floor(
                    Math.random() * 3
                );


            const shonbenDice =
                dice[randomIndex];


            result.textContent =
                "ションベン…";


            await animateShonben(
                shonbenDice
            );


            result.textContent =
                "残念、おわんからでてしまった！あなたはしょんべんです";


            result.className =
                "role-none";


            rollButton.disabled =
                false;


            return;

        }


        /* =================================
           出た目を表示
        ================================= */

        dice.forEach(
            (die, index) => {

                showDice(
                    die,
                    numbers[index]
                );

            }
        );


        /* =================================
           役を判定
        ================================= */

        const role =
            checkRole(numbers);


        /* =================================
           役を表示＋演出
        ================================= */

        showRole(role);


        rollButton.disabled =
            false;

    }
);