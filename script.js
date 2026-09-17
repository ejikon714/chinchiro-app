const dice = [
    document.querySelector("#dice1"),
    document.querySelector("#dice2"),
    document.querySelector("#dice3")
];

const rollButton =
    document.querySelector("#rollButton");

const result =
    document.querySelector("#result");


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


        /* =================================
           3個とも同じ時間
        ================================= */

        const duration =
            2050;


        const startTime =
            performance.now();


        /* =================================
           回転量
        ================================= */

        const turnsX =
            random(8, 11);

        const turnsY =
            random(8, 12);

        const turnsZ =
            random(5, 8);


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


        /* =================================
           スタート位置
        ================================= */

        const startX =
            random(-20, 20);

        const startZ =
            random(-15, 15);


        /* =================================
           ★ 停止位置
           
           3個を近めの等間隔に配置
        ================================= */

        const endPositions = [

            -100,
            0,
            100

        ];


        const endX =
            endPositions[index];


        const endZ =
            random(-5, 5);


        /* =================================
           上から落ちてくる
        ================================= */

        const startY =
            -130;


        /* =================================
           アニメーション
        ================================= */

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


            /* =================================
               なめらかな減速
            ================================= */

            const eased =
                easeOutQuint(t);


            /* =================================
               横移動
            ================================= */

            const x =
                startX +
                (endX - startX)
                * eased;


            /* =================================
               縦移動
            ================================= */

            let y =
                startY +
                Math.abs(
                    Math.sin(
                        t * Math.PI
                    )
                ) * -35
                +
                130 * eased;


            /* =================================
               着地
            ================================= */

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


            /* =================================
               奥行き
            ================================= */

            const z =
                startZ +
                (endZ - startZ)
                * eased;


            /* =================================
               回転
            ================================= */

            let rx =
                spinX * eased;

            let ry =
                spinY * eased;

            let rz =
                spinZ * eased;


            /* =================================
               停止直前の揺れ
               
               小さくして硬直を減らす
            ================================= */

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
                    * 0.6
                    * strength;


                extraY =
                    Math.sin(
                        settle *
                        Math.PI *
                        2.2
                    )
                    * 0.5
                    * strength;


                extraZ =
                    Math.sin(
                        settle *
                        Math.PI *
                        1.7
                    )
                    * 0.4
                    * strength;

            }


            /* =================================
               最後に正面へ
               
               3個とも同じタイミング
            ================================= */

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


            /* =================================
               表示
            ================================= */

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


            /* =================================
               終了
            ================================= */

            if (t < 1) {

                requestAnimationFrame(frame);

            } else {

                /*
                 * 3個とも同じタイミングで
                 * 正面を向いて停止
                 */

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

                requestAnimationFrame(frame);

            } else {

                resolve();

            }

        }


        requestAnimationFrame(frame);

    });

}


/* ========================================
   サイコロを振る
======================================== */

rollButton.addEventListener(
    "click",
    async () => {

        rollButton.disabled = true;


        result.textContent =
            "役：サイコロを振っています…";


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
           役を表示
        ================================= */

        const role =
            checkRole(numbers);


        result.textContent =
            "役：" + role;


        rollButton.disabled =
            false;

    }
);