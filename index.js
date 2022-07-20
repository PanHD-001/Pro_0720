(
    function() {
        const dom = {
            audio: document.querySelector('audio'),
            container: document.querySelector('.container'),
            ul: document.querySelector('.container ul'),
        }

        const size = {
            liHeight: 30,
            containerHeight: 420
        }

        let lrcData;

        async function getLrc() {
            return await fetch('https://study.duyiedu.com/api/lyrics')
                .then((resp) => resp.json())
                .then((resp) => resp.data);
        }

        async function init() {
            const lrc = await getLrc();
            let arr = lrc.split('\n');
            arr = arr.filter((item, i) => {
                return i !== 0;
            });
            lrcData = arr.map((item) => {
                let time = getSecond(item.substring(0, 10).substring(1, 9));
                let text = item.substring(10);
                return {
                    time,
                    text
                }
            });
            dom.ul.innerHTML = lrcData.map(item => `<li>${item.text}</li>`).join('');
        }
        init();

        function getSecond(time) {
            let min = Number(time.substring(0, 2));
            let sec = Number(time.substring(3, 8));
            return min * 60 + sec;
        }

        dom.audio.addEventListener('timeupdate', function() {
            setLrcStatus(this.currentTime);
        });

        function setLrcStatus(time) {
            time += 0.3;
            let index = lrcData.findIndex(item => item.time > time) - 1;
            if (index < 0) return;
            let activeLi = document.querySelector('.active');
            activeLi && activeLi.classList.remove('active');
            dom.ul.children[index].classList.add('active');
            scrollLrc(index);
        }

        function scrollLrc(index) {
            let top = index * size.liHeight + size.liHeight / 2 - size.containerHeight / 2;
            if (top < 0) top = 0;
            dom.ul.style.transform = `translateY(-${top}px)`;
        }

    }
)();