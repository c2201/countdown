// Part1 时间间隔设置
let intervalDuration = 15 * 1000;
let phraseTimer = null;

// 滑动条和输入框事件
document.getElementById('intervalSlider').addEventListener('input', function(e) {
    const value = Math.min(120, Math.max(1, parseInt(e.target.value) || 15));
    intervalDuration = value * 1000;
    document.getElementById('intervalValue').value = value;
    // 如果自动轮播开启则立即应用新间隔
    if (goldenSwitch.checked && phraseTimer) {
        clearInterval(phraseTimer);
        phraseTimer = setInterval(fetchGoldenPhrase, intervalDuration);
    }
});

document.getElementById('intervalValue').addEventListener('input', function(e) {
    const value = Math.min(120, Math.max(1, parseInt(e.target.value) || 15));
    intervalDuration = value * 1000;
    document.getElementById('intervalSlider').value = value;
});

// 重置间隔
function resetInterval() {
    intervalDuration = 15 * 1000;
    document.getElementById('intervalSlider').value = 15;
    document.getElementById('intervalValue').value = 15;
    
    if (goldenSwitch.checked && phraseTimer) {
        clearInterval(phraseTimer);
        phraseTimer = setInterval(fetchGoldenPhrase, intervalDuration);
    }
}

// Part2 概率控制
let apiProbability = 50;

// 滑动条输入事件监听
document.getElementById('apiProbability').addEventListener('input', function(e) {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    apiProbability = value;
    document.getElementById('apiProbabilityValue').value = value;
});

// 数值输入框事件监听
document.getElementById('apiProbabilityValue').addEventListener('input', function(e) {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    apiProbability = value;
    document.getElementById('apiProbability').value = value;
});

// 重置按钮
function resetProbability() {
    apiProbability = 50;
    document.getElementById('apiProbability').value = 50;
    document.getElementById('apiProbabilityValue').value = 50;
}

// Part3 公告板
const announcementButton = document.getElementById('announcementButton');
const announcementModal = document.getElementById('announcementModal');
const closeAnnouncement = document.getElementById('closeAnnouncement');

// 打开公告
announcementButton.addEventListener('click', () => {
    announcementModal.classList.add('active');
});

// 关闭公告
closeAnnouncement.addEventListener('click', () => {
    announcementModal.classList.remove('active');
});

// Part4 更新日志功能
const changelogButton = document.getElementById('changelogButton');
const changelogModal = document.getElementById('changelogModal');
const closeChangelog = document.getElementById('closeChangelog');

// 打开更新日志
changelogButton.addEventListener('click', () => {
    changelogModal.classList.add('active');
});

// 关闭更新日志
closeChangelog.addEventListener('click', () => {
    changelogModal.classList.remove('active');
});

// Part5 设置
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeButton = document.getElementById('closeSettings');

// 打开设置
settingsButton.addEventListener('click', () => {
    settingsModal.classList.add('active');
});

// 关闭设置
closeButton.addEventListener('click', () => {
    settingsModal.classList.remove('active');
});

// Part6 作息显示功能
// 时间转换函数
function timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

// 获取当前作息
function getCurrentSchedule() {
    const now = new Date();
    const day = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    // 如果是周末
    if(day === 0 || day === 6) return {current: "周末", nextLesson: ""};
    const todaySchedule = schedule.weekday;
    let current = "";
    let nextLesson = "";
    // 处理跨天时段（22:20-7:00）
    if(currentMinutes >= timeToMinutes("22:20") || currentMinutes < timeToMinutes("7:00")) {
        current = "洗漱睡觉";
        nextLesson = "无";  // 明确设置为"无"
        return {current, nextLesson};  // 直接返回，不查找下节课
    }
    // 查找当前时间段
    let currentIndex = -1;
    for(let i = 0; i < todaySchedule.length; i++) {
        const [start, end] = todaySchedule[i][0].split('-');
        const startTime = timeToMinutes(start);
        const endTime = timeToMinutes(end);
        if(currentMinutes >= startTime && currentMinutes < endTime) {
            current = todaySchedule[i][1];
            currentIndex = i;
            break;
        }
    }
    // 查找下一个"节课"
    if(currentIndex >= 0) {
        for(let i = currentIndex + 1; i < todaySchedule.length; i++) {
            if(todaySchedule[i][1].endsWith("节课") || todaySchedule[i][1].endsWith("考试")) {
                nextLesson = todaySchedule[i][1];
                break;
            }
        }
        // 如果没有找到下节课，则设置为"无"
        if(!nextLesson) {
            nextLesson = "无";
        }
    }
    return {current, nextLesson};
}

// 获取课程名称
function getCourseName(day, lessonIndex) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const timetableDay = timetable[days[day]];
    return timetableDay ? timetableDay[lessonIndex] : "";
}

// 更新作息显示
function updateScheduleDisplay() {
    const now = new Date();
    const day = now.getDay();  
    const {current, nextLesson} = getCurrentSchedule();
    
    // 当前作息
    let currentText = current;
    if(current.includes(" 课")) {
        const lessonItems = schedule.weekday.filter(item => 
            item[1].endsWith("节课") || item[1].endsWith("考试"));
        const currentLessonIndex = lessonItems.findIndex(item => item[1] === current);
        if(currentLessonIndex >=0 && currentLessonIndex <9) {
            currentText = getCourseName(day, currentLessonIndex);
        }
    }
    document.getElementById('currentSchedule').textContent = currentText;
    
    // 下节课
    let nextText = nextLesson;
    if(nextLesson) {
        const lessonItems = schedule.weekday.filter(item => 
            item[1].endsWith("节课") || item[1].endsWith("考试"));
        const nextLessonIndex = lessonItems.findIndex(item => item[1] === nextLesson);
        if(nextLessonIndex >=0 && nextLessonIndex <9) {
            nextText = getCourseName(day, nextLessonIndex);
        }
    }
    document.getElementById('nextSchedule').textContent = nextText || "无";
    
    // 课表
    if(day >=1 && day <=5) {
        const courses = timetable[Object.keys(timetable)[day-1]];
        document.getElementById('todayTimetable').innerHTML = courses.map((c,i) => 
            `<div class="timetable-item">${i+1}&nbsp;${c}</div>`
        ).join('');
    } else {
        document.getElementById('todayTimetable').innerHTML = 
            '<div class="timetable-item">周末无课表</div>';
    }
}

// Part7 金句功能
const GOLDEN_APIs = [
    'https://img.8845.top/yiyan/index.php', 
    'https://api.mu-jie.cc/stray-birds/range?type=json', 
    'https://v.api.aa1.cn/api/api-wenan-mingrenmingyan/index.php?aa1=json' 
];

let currentApiIndex = 0;

async function fetchGoldenPhrase() {
    if (Math.random()  < apiProbability / 100) {
        try {
            const apiIndex = Math.floor(Math.random()  * GOLDEN_APIs.length); 
            const api = GOLDEN_APIs[1];
            const response = await fetch(api);
            if (!response.ok)  throw new Error('网络异常');
            const data = await response.json(); 
            let text = data.cn + "——泰戈尔"; 
            if (!text) {
                throw new Error('数据异常');
            }
            updatePhraseDisplay(text);
        } catch (error) {
            console.warn('  金句API获取失败:', error);
            showLocalPhrase();
        }
    } else {
        showLocalPhrase();
    }
}

function updatePhraseDisplay(text) {
    const container = document.getElementById('goldenPhrase');
    const animationEnabled = document.getElementById('animationSwitch').checked;
    
    if (animationEnabled) {
        container.style.opacity = 0;
        setTimeout(() => {
            container.textContent = `「 ${text} 」`;
            container.style.opacity = 1;
        }, 500);
    } else {
        container.textContent = `「 ${text} 」`;
        container.style.opacity = 1;
    }
}

// 动画开关事件监听
document.getElementById('animationSwitch').addEventListener('change', function() {
    const goldenPhrase = document.getElementById('goldenPhrase');
    if (this.checked) {
        goldenPhrase.classList.remove('no-animation');
    } else {
        goldenPhrase.classList.add('no-animation');
    }
});

function showLocalPhrase() {
    // 加权选择池
    const weightedPool = [
        ...localPhrases.high.map(p => ({ p, w: 45 })),   // 高概率区：权重4.5
        ...localPhrases.medium.map(p => ({ p, w: 35 })), // 中概率区：权重3.5
        ...localPhrases.low.map(p => ({ p, w: 20 }))     // 低概率区：权重2.0
    ];
    // 计算总权重
    const totalWeight = weightedPool.reduce((sum, item) => sum + item.w, 0);
    // 生成随机数
    let random = Math.random() * totalWeight;
    // 遍历选择池寻找命中项
    for (const item of weightedPool) {
        if (random < item.w) {
            return updatePhraseDisplay(item.p);
        }
        random -= item.w;
    }
}

// Part8 二十四节气时间轴
// 生成节气标记 
function generateSolarMarkers() {
    const springStart = solarTerms.find(t  => t.name  === '立春');
    const startDate = new Date(2025, springStart.month,  springStart.day); 
    const endDate = new Date(2025, 5, 18);
    const totalDays = (endDate - startDate) / 86400000;
    document.querySelectorAll('.solar-term-marker').forEach(m  => m.remove()); 
    solarTerms.forEach(term  => {
        const termDate = new Date(2025, term.month,  term.day); 
        if (termDate < startDate || termDate > endDate) return;
        const position = ((termDate - startDate) / 86400000 / totalDays) * 100;
        const isPast = termDate < new Date();
        const marker = document.createElement('div'); 
        marker.className  = 'solar-term-marker';
        marker.style.left  = `${position}%`;
        marker.innerHTML  = `
            <div style="color: ${isPast ? '#666' : term.color}; 
                font-weight: ${isPast ? 'normal' : '600'};
                text-shadow: ${isPast ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'}">
                ${term.name} 
            </div>
            <div style="font-size:0.9em; color: ${isPast ? '#999' : '#666'};
                margin-top: 5px">
                ${termDate.getMonth()+1}  月${termDate.getDate()}  日 
            </div>
        `;
        marker.addEventListener('mouseover',  () => {
            if (!isPast) {
                marker.style.transform  = 'translateX(-50%) scale(1.1)';
                // marker.style.filter  = 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))';
            }
        });
        marker.addEventListener('mouseout',  () => {
            marker.style.transform  = 'translateX(-50%) scale(1)';
            marker.style.filter  = 'none';
        });
        timeline.appendChild(marker); 
        // 创建卡片
        const card = document.createElement('div');
        card.className = 'solar-card';
        card.innerHTML = `
            <h3>${term.name}</h3>
            <img src="${term.image}" alt="${term.name}">
            <p>${term.desc}</p>
        `;
        marker.appendChild(card);
        // 点击事件处理
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            const allCards = document.querySelectorAll('.solar-card');
            allCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    // 点击其他区域隐藏卡片
    document.addEventListener('click', () => {
        document.querySelectorAll('.solar-card').forEach(c => c.classList.remove('active'));
    });
}

// 时间轴
function updateTimelineColor() {
    const springStart = solarTerms.find(t  => t.name  === '立春');
    const startDate = new Date(2025, springStart.month,  springStart.day); 
    const endDate = new Date(2025, 5, 18);
    const now = new Date();
    const total = endDate - startDate;
    const progress = Math.min(1,  Math.max(0,  (now - startDate) / total));
    timeline.style.setProperty('--progress-percent',  `${progress * 100}%`);
    requestAnimationFrame(updateTimelineColor);
}

// Part9 中考倒计时
function updateCountdown() {
    const target = new Date(2025, 5, 18);
    const diff = target - new Date();
    const days = Math.max(0,  Math.ceil(diff  / 86400000));
    document.getElementById('daysUntil').textContent  = `${days}天`;

    const now = new Date();
    const msToNextDay = 86400000 - (now % 86400000);
    setTimeout(updateCountdown, msToNextDay);
}

// Part10 时钟显示
function updateClock() {
    const date = new Date();
    const weekDays = ['日','一','二','三','四','五','六'];
    // 时间部分 
    const hh = date.getHours().toString().padStart(2,  '0');
    const mm = date.getMinutes().toString().padStart(2,  '0');
    const ss = date.getSeconds().toString().padStart(2,  '0');
    // 日期部分 
    const yyyy = date.getFullYear(); 
    const m = (date.getMonth()  + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2,  '0');
    const week = weekDays[date.getDay()];
    document.getElementById('currentDateTime').innerHTML  = `
        <div class="time-section">${hh}:${mm}:${ss}</div>
        <div class="date-section">${yyyy}/${m}/${d} 周${week}</div>
    `;
    requestAnimationFrame(updateClock);
}

function fetchAndDisplayImage(url) {
    fetch('https://api.cenguigui.cn/api/60s/')
        .then(response => response.blob()) 
        .then(blob => {
            const img = document.getElementById('apiImage'); 
            img.src  = URL.createObjectURL(blob); 
            img.style.height  = '80vh';
        })
        .catch(error => console.error(' 图片加载失败:', error));
}

// Part11 金句自动轮播和显示每日60s开关
// 初始化开关状态
const goldenSwitch = document.getElementById('goldenSwitch'); 
const imageSwitch = document.getElementById('imageSwitch'); 
const apiImage = document.getElementById('apiImage'); 

// 金句自动轮播开关
goldenSwitch.addEventListener('change', function() {
    if (this.checked) {
        phraseTimer = setInterval(fetchGoldenPhrase, intervalDuration);
    } else {
        clearInterval(phraseTimer);
        phraseTimer = null;
    }
});

// 显示每日60s开关
imageSwitch.addEventListener('change',  function() {
    if (this.checked)  {
        apiImage.style.display  = 'block';
        fetchAndDisplayImage();
        setInterval(fetchAndDisplayImage, 86400000);
    } else {
        apiImage.style.display  = 'none';
        clearInterval(imageUpdateInterval);
    }
});

// 初始化时设置默认状态
goldenSwitch.checked  = true; // 默认开启金句自动轮播
imageSwitch.checked  = true; // 默认开启每日60s显示

// Part12 天气
function fetchWeather() {
    fetch('https://v2.api-m.com/api/weather?city=%E5%B2%B3%E9%BA%93%E5%8C%BA')
        .then(response => {
            if (!response.ok) throw new Error('网络响应异常');
            return response.json();
        })
        .then(data => {
        if (data.code === 200) {
            // 获取当前星期（示例返回格式："周五"）
            const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
            const currentDay = '周' + weekDays[new Date().getDay()];
            // 查找匹配的天气数据
            const todayWeather = data.data.data.find(item => item.date === currentDay);
            if (todayWeather) {
                // 格式化温度显示（7-10℃ → 7~10℃）
                const tempRange = todayWeather.temperature.replace('-', '~');
                document.getElementById('weatherInfo').textContent = 
                `${todayWeather.weather} ${tempRange}`;
            } else {
                document.getElementById('weatherInfo').textContent = '天气数据异常';
            }
        } else {
            throw new Error(data.msg);
        }
        })
    .catch(error => {
        console.error('天气获取失败:', error);
        document.getElementById('weatherInfo').textContent = '天气获取失败';
    });
}

window.onload  = function() {
    fetchAndDisplayImage();
};

// Part13 点击刷新金句功能
document.getElementById('goldenPhrase').addEventListener('click', function() {
    const clickRefreshEnabled = document.getElementById('clickRefreshSwitch').checked;
    const autoRotateEnabled = document.getElementById('goldenSwitch').checked;
    const animationEnabled = document.getElementById('animationSwitch').checked;
    
    if (clickRefreshEnabled) {
        // 当动画关闭时直接显示新内容
        if (!animationEnabled) {
            fetchGoldenPhrase();
            return;
        }
        // 保留原有缩放动画
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            fetchGoldenPhrase();
        }, 300);
        if (autoRotateEnabled && phraseTimer) {
            clearInterval(phraseTimer);
            phraseTimer = setInterval(fetchGoldenPhrase, intervalDuration);
        }
    }
});

// Part14 金句选择功能
const phraseModal = document.getElementById('phraseModal');
const closePhrase = document.getElementById('closePhrase');
const phraseButton = document.getElementById('phraseSelectButton'); 

// 打开金句选择
function populatePhraseList() {
    const allPhrases = [...localPhrases.high, ...localPhrases.medium, ...localPhrases.low];
    const phraseList = document.getElementById('phraseList');
    
    // 清空现有内容
    phraseList.innerHTML = '';
    
    // 使用文档片段批量添加
    const fragment = document.createDocumentFragment();
    
    allPhrases.forEach(phrase => {
        const div = document.createElement('div');
        div.className = 'phrase-item';
        div.textContent = phrase;
        
        // 添加点击事件
        div.addEventListener('click', function() {
            // 添加点击效果
            this.classList.add('phrase-click-effect');
            
            // 移除动画类（用于重复点击）
            setTimeout(() => {
                this.classList.remove('phrase-click-effect');
            }, 400);
            
            // 更新显示（保留原有动画逻辑）
            updatePhraseDisplay(phrase);
        });
        
        fragment.appendChild(div);
    });
    
    phraseList.appendChild(fragment);
}

// 修改打开模态框事件
phraseButton.addEventListener('click', () => {
    populatePhraseList();
    phraseModal.classList.add('active');
});

// 关闭金句选择
closePhrase.addEventListener('click', () => {
    phraseModal.classList.remove('active');
});

// Part15 寻物功能
const lostAndFoundButton = document.getElementById('lostAndFoundButton');
const lostAndFoundModal = document.getElementById('lostAndFoundModal');
const closeLostAndFound = document.getElementById('closeLostAndFound');

// 打开寻物板
lostAndFoundButton.addEventListener('click', () => {
    lostAndFoundModal.classList.add('active');
});

// 关闭寻物板
closeLostAndFound.addEventListener('click', () => {
    lostAndFoundModal.classList.remove('active');
});

// 编辑功能
document.getElementById('lostAndFoundList').addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('editable')) {
        const originalText = target.textContent;
        const input = document.createElement('input');
        input.className = 'edit-input';
        input.value = originalText;
        input.style.width = target.offsetWidth + 'px';
        
        input.addEventListener('blur', function() {
            target.textContent = this.value;
            target.style.display = 'inline';
            input.remove();
        });

        input.addEventListener('input', function() {
            this.style.width = (this.value.length * 20 + 30) + 'px';
        });

        target.style.display = 'none';
        target.parentNode.insertBefore(input, target);
        input.focus();
    }
});

// 添加卡片功能
document.querySelector('.add-button').addEventListener('click', () => {
    const newCard = document.createElement('div');
    newCard.className = 'announcement-card';
    newCard.innerHTML = `
        <div class="announcement-body" style="position:relative; text-align: center; font-size: 28px; font-family: STZhongsong, serif;">
            <span class="editable" data-type="name" style="color: #1E90FF;">同学</span>&nbsp;的
            <span class="editable" data-type="item" style="color: #1E90FF;">物品</span>
            <button class="delete-btn">删除</button>
        </div>
    `;
    document.getElementById('lostAndFoundList').appendChild(newCard);
});

// 删除功能（使用事件委托）
document.getElementById('lostAndFoundList').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        if (e.target.textContent === '删除') {
            e.target.textContent = '确认删除';
            e.target.style.background = '#d32f2f';
        } else {
            e.target.closest('.announcement-card').remove();
        }
    }
});

// 重置删除按钮状态（当点击其他地方时）
document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('delete-btn')) {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.textContent = '删除';
            btn.style.background = '#ff4444';
        });
    }
});

// PartLast 初始化 
function init() {
    updateCountdown();
    updateClock();
    updateTimelineColor();
    generateSolarMarkers();
    fetchGoldenPhrase();
    phraseTimer = setInterval(fetchGoldenPhrase, intervalDuration);
    setInterval(updateScheduleDisplay, 1000);
    fetchWeather();
    setInterval(fetchWeather, 15000);
}

init();

window.addEventListener('unload',  () => clearInterval(phraseTimer));
setInterval(() => {
    generateSolarMarkers();
    updateCountdown();
}, 86400000);