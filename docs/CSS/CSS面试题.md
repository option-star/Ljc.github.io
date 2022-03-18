+

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203151045143.webp)

## 一、CSS基础

### 1. CSS选择器及其优先级

| **选择器**     | **格式**      | **优先级权重** |
| -------------- | ------------- | -------------- |
| id选择器       | #id           | 100            |
| 类选择器       | #classname    | 10             |
| 属性选择器     | a[ref=“eee”]  | 10             |
| 伪类选择器     | li:last-child | 10             |
| 标签选择器     | div           | 1              |
| 伪元素选择器   | li:after      | 1              |
| 相邻兄弟选择器 | h1+p          | 0              |
| 子选择器       | ul>li         | 0              |
| 后代选择器     | li a          | 0              |
| 通配符选择器   | *             | 0              |

对于选择器的**优先级**：

- 标签选择器、伪元素选择器：1
- 类选择器、伪类选择器、属性选择器：10
- id 选择器：100
- 内联样式：1000

**注意事项：**

- !important声明的样式的优先级最高；
- 如果优先级相同，则最后出现的样式生效；
- 继承得到的样式的优先级最低；
- 通用选择器（*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0 ；
- 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

### 2.标准的CSS盒子模型及其和低版本的IE盒子模型的区别？

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203151455850.webp)



![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/17263443113eb879~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

CSS3中的盒模型有以下两种：标准盒子模型、IE盒子模型

盒模型都是由四个部分组成的，分别是margin、border、padding和content

标准盒模型和IE盒模型的区别在于设置width和height时，所对应的范围不同：

- 标准盒模型的width和height属性的范围只包含了content，
- IE盒模型的width和height属性的范围包含了border、padding和content。

可以通过修改元素的box-sizing属性来改变元素的盒模型：

- `box-sizeing: content-box`表示标准盒模型（默认值）
- `box-sizeing: border-box`表示IE盒模型（怪异盒模型）






### 3. CSS选择符有哪些？哪些属性可以继承？

常见的选择符有一下：

`id`选择器（`#content`），类选择器（`.content`）, 标签选择器（`div`, `p`, `span`等）, 相邻选择器（`h1+p`）, 子选择器（`ul>li`）, 后代选择器（`li a`）， 通配符选择器（`*`）, 属性选择器（`a[rel = "external"]`）， 伪类选择器（`a:hover`, `li:nth-child`）

可继承的样式属性： `font-size`, `font-family`, `color`, `ul`, `li`, `dl`, `dd`, `dt`;

不可继承的样式属性： `border`, `padding`, `margin`, `width`, `height`；

### 4. CSS优先级算法如何计算？

- 考虑到就近原则，同权重情况下样式定义以最近者为准
- 载入的样式按照最后的定位为准

优先级排序：

同权重情况下： 内联样式表（标签内部）> 嵌入样式表（当前文件中）> 外部样式表（外部文件中）

```
!important > # > . > tag
```

🍀**注意**：  `!important` 比 内联优先级高

### 5. display有哪些值？他们的作用有？

| 值                 | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| none               | 使用后元素将不会显示                                         |
| grid               | 定义一个容器属性为网格布局                                   |
| flex               | 定义一个弹性布局                                             |
| block              | 使用后元素将变为块级元素显示，元素前后带有换行符             |
| inline             | display默认值。使用后原色变为行内元素显示，前后无换行符      |
| list-item          | 使用后元素作为列表显示                                       |
| run-in             | 使用后元素会根据上下文作为块级元素或行内元素显示             |
| table              | 使用后将作为块级表格来显示（类似`<table>`），前后带有换行符  |
| inline-table       | 使用后元素将作为内联表格显示（类似`<table>`），前后没有换行符 |
| table-row-group    | 元素将作为一个或多个行的分组来显示（类似`<tbody>`）          |
| table-hewder-group | 元素将作为一个或多个行的分组来表示（类似`<thead>`）          |
| table-footer-group | 元素将作为一个或多个行分组显示（类似`<tfoot>`）              |
| table-row          | 元素将作为一个表格行显示（类似`<tr>`）                       |
| table-column-group | 元素将作为一个或多个列的分组显示（类似`<colgroup>`）         |
| table-column       | 元素将作为一个单元格列显示（类似`<col>`）                    |
| table-cell         | 元素将作为一个表格单元格显示（类似`<td>和<th>`）             |
| table-caption      | 元素将作为一个表格标题显示（类似`<caption>`）                |
| inherit            | 规定应该从父元素集成display属性的值                          |

其中，常用的有：`block`， `inline-block`， `none`， `table`， `line`。

### 6. 什么是响应式设计？响应式设计的基本原理是什么？如何兼容低版本的IE？

响应式网站设计`（Responsive Web design`）是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

关于原理： 基本原理是通过媒体查询`（@media）`查询检测不同的设备屏幕尺寸做处理。

关于兼容： 页面头部必须有mate声明的`viewport`。

```css
<meta name="’viewport’" content="”width=device-width," initial-scale="1." maximum-scale="1,user-scalable=no”"/>
```

### 7. 为什么要初始化CSS样式？

因为浏览器的兼容问题，不同浏览器对标签的默认值是不同的，如果没有对浏览器的`CSS`初始化，会造成相同页面在不同浏览器的显示存在差异。

### 8. 浮动原理以及为什么会出现浮动和什么时候需要清除浮动？清除浮动的方式？

非IE浏览器下，容器不设定高度且子元素浮动时，容器高度不能被内容撑开。此时，内容会溢出到容器外面而影响布局。此类现象被称为浮动（溢出）。

原理：

- 浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）；
- 浮动元素碰到包含它的边框或其他浮动元素的边框停留。

浮动元素碰到包含他的边框或者浮动元素的边框停留。由于浮动元素不在文档流之中，文档流的块级框会表现的就像浮动框不存在一样。浮动元素会漂浮在文档流的块级框之上。

浮动会带来的问题：

- 父级元素的高度将会无法被撑开，会影响与父级元素同级的元素
- 与浮动元素同级的非浮动元素（内联元素）会跟随其后
- 若浮动的元素不是第一个元素，则该元素之前的元素也要浮动，否则会影响页面的显示结构

清除方式：

- 父级盒子定义高度`（height）`;
- 最后一个浮动元素后面加一个`div`空标签，并且添加样式`clear: both`;
- 包含浮动元素的父级标签添加样式`overflow`为`hidden/both`;
- 父级`div`定义`zoom`;



### 9. CSS优化、提高性能的方法有哪些？

- 多个`css`可合并，并尽量减少`http`请求

- 属性值为0时，不加单位

- 将`css`文件放在页面最上面

- 避免后代选择符，过度约束和链式选择符

- 使用紧凑的语法

- 避免不必要的重复

- 使用语义化命名，便于维护

- 尽量少的使用`!impotrant`，可以选择其他选择器

- 精简规则，尽可能合并不同类的重复规则

- 遵守盒子模型规则

### 10. display的block、inline和inline-block的区别？

- `block`：独占一行，默认继承父元素的宽度；多个块级元素从上到下进行排列；可以设置 with、height、margin 和 padding
- `inline`：不会独占一行，宽度随着内容而变化；多个 inline 元素将按照从左到右的顺序在一行里排列显示，如果一行显示不下，则自动换行；inline 元素设置 with、height 无效，可以设置水平 margin，垂直 margin 无效，可以设置 padding；
- `inline-block`：不会独占一行，可以设置 with、height、margin 和 padding

### 11. 隐藏元素的方法有哪些？

1. **opacity**：透明度，设置值为0可以隐藏元素，但依旧占据位置并且可响应绑定事件

2. **visibility**：可见度，设置值为 hidden 可以隐藏元素，但依旧占据位置，不可响应绑定事件

3. **display**：设置值为 none 可以隐藏元素，不占据位置也不响应绑定事件

4. **position**：设置值为 absolute，top 和 left 设置为负值脱离页面，不占据位置也不响应绑定事件

```css
.hidd{
     position: absolute;
     top:-10000px;
     left: -10000px;
}
```

5. **clip-path**：使用元素裁剪来隐藏元素，占据位置但不响应绑定事件

```css
.clip{
     clip-path: polygon(0px 0px,0px 0px,0px 0px,0px 0px);
}
```

6. **position 和 clip 配合**：可以隐藏元素，不占据位置页不下响应事件

```css
.poclip{
     position: absolute;
     clip:rect(0px,0px,0px,0px);
}
```
7. **transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。



### 12. link 和@import的区别？

link 和 @import 都能导入一个样式文件，区别如下：

1. link 是 HTML 标签，除了能导入 CSS 外，还能导入别的资源，比如图片、脚本和字体等；而 @import 是 CSS 的语法，**只能用来导入 CSS**；
2. link 导入的样式会在页面加载时同时加载，@import 导入的样式需要等待页面加载完成后再加载；
3. link 没有**兼容性问题**，@import 不兼容 ie5 以下；
4. link 可以通过 JS 操作 DOM 动态引入样式表改变样式，而 @import 不行。

### 13. transition 和 animation 的区别？

1. transition **只有两个状态**：开始状态和结束状态，但 animation 可能是**多个状态**，有帧的概念
2. transition 需要**借助别的方式来触发**，比如 CSS 的状态选择器（如 `:hover`）或借助 JavaScript 来触发；animation 可以**自动触发**。

### 14. display:none与visibility:hidden的区别？

从结果上看，它们两个的作用都是隐藏 HTML 元素，但也有明显的区别：

1. **不占据空间** ：display:none 让隐藏的元素**不占据空间**；visibility:hidden 让隐藏的元素**占据空间**。
2. **回流**： display 要显示元素的话会**触发回流，进行渲染**；visibility 要显示元素的话会**进行重绘，不进行渲染**。
3. **不继承**： display **不是继承属性**，其子元素也会跟着消失；visibility **是继承属性**。

### 15. 伪元素与伪类的区别和作用？

- **伪类**用于当已有的元素**处于某种状态时，为其添加对应的样式**，这个状态是根据用户行为而动态变化的。比如说当用户悬停在指定的元素时，我们可以通过`:hover`来描述这个元素的状态。
- **伪元素**用于**创建一些不在文档树中的元素，并为其添加样式**。它们允许我们为元素的某些部分设置样式。比如说，我们可以通过`::before`来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

### 16. 对requestAnimationframe的理解？

实现动画效果的方法比较多，Javascript 中可以通过定时器 setTimeout 来实现，CSS3 中可以使用 transition 和 animation 来实现，HTML5 中的 canvas 也可以实现。除此之外，HTML5 提供一个专门用于请求动画的API，那就是 requestAnimationFrame，顾名思义就是**请求动画帧**。

MDN对该方法的描述：

:::tip

​	window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

:::

**语法：** `window.requestAnimationFrame(callback);`  其中，callback是**下一次重绘之前更新动画帧所调用的函数**(即上面所说的回调函数)。该回调函数会被传入DOMHighResTimeStamp参数，它表示requestAnimationFrame() 开始去执行回调函数的时刻。该方法属于**宏任务**，所以会在执行完微任务之后再去执行。

**取消动画：** 使用cancelAnimationFrame()来取消执行动画，该方法接收一个参数——requestAnimationFrame默认返回的id，只需要传入这个id就可以取消动画了。

**优势：**

- **CPU节能**：使用SetTinterval 实现的动画，当页面被隐藏或最小化时，SetTinterval 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费CPU资源。而RequestAnimationFrame则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统走的RequestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。
- **函数节流**：在高频率事件( resize, scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，RequestAnimationFrame可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销，一个刷新间隔内函数执行多次时没有意义的，因为多数显示器每16.7ms刷新一次，多次绘制并不会在屏幕上体现出来。
- **减少DOM操作**：requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。

**setTimeout执行动画的缺点**：它通过设定间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿、抖动的现象；原因是：

- settimeout任务被放入异步队列，只有当主线程任务执行完后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；
- settimeout的固定时间间隔不一定与屏幕刷新间隔时间相同，会引起丢帧。



### 17. 为什么有时候用translate来改变位置而不是定位

​	translate 是 transform 属性的⼀个值。改变transform或opacity不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。

​	transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此translate()更⾼效，可以缩短平滑动画的绘制时间。 ⽽translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。

### 18. li 与 li 之间有看不见的空白间隔是什么原因引起的？如何解决？

浏览器会把inline内联元素间的空白字符（空格、换行、Tab等）渲染成一个空格。为了美观，通常是一个`<li>`放在一行，这导致`<li>`换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。

**解决方法**：

（1）为`<li>`设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。

（2）将所有`<li>`写在同一行。不足：代码不美观。

（3）将`<ul>`内的字符尺寸直接设为0，即font-size:0。不足：`<ul>`中的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且在Safari浏览器依然会出现空白间隔。

（4）消除`<ul>`的字符间隔letter-spacing:-8px，不足：这也设置了`<li>`内的字符间隔，因此需要将`<li>`内的字符间隔设为默认letter-spacing:normal。



### 19. CSS3中有哪些新特性

- 新增各种CSS选择器 （: not(.input)：所有 class 不是“input”的节点）

- 圆角 （border-radius:8px）

- 多列布局 （multi-column layout）

- 阴影和反射 （Shadoweflect）

- 文字特效 （text-shadow）

- 文字渲染 （Text-decoration）

- 线性渐变 （gradient）

- 旋转 （transform）

- 增加了旋转,缩放,定位,倾斜,动画,多背景

### 20. 替换元素的概念及计算规则

​	通过修改某个属性值呈现的内容就可以被替换的元素就称为“替换元素”。

​	替换元素除了内容可替换这一特性以外，还有以下特性：

- **内容的外观不受页面上的CSS的影响**：用专业的话讲就是在样式表现在CSS作用域之外。如何更改替换元素本身的外观需要类似appearance属性，或者浏览器自身暴露的一些样式接口。
- **有自己的尺寸**：在Web中，很多替换元素在没有明确尺寸设定的情况下，其默认的尺寸（不包括边框）是300像素×150像素，如
- **在很多CSS属性上有自己的一套表现规则**：比较具有代表性的就是vertical-align属性，对于替换元素和非替换元素，vertical-align属性值的解释是不一样的。比方说vertical-align的默认值的baseline，很简单的属性值，基线之意，被定义为字符x的下边缘，而替换元素的基线却被硬生生定义成了元素的下边缘。
- **所有的替换元素都是内联水平元素**：也就是替换元素和替换元素、替换元素和文字都是可以在一行显示的。但是，替换元素默认的display值却是不一样的，有的是inline，有的是inline-block。

替换元素的尺寸从内而外分为三类：

- **固有尺寸：** 指的是替换内容原本的尺寸。例如，图片、视频作为一个独立文件存在的时候，都是有着自己的宽度和高度的。
- **HTML尺寸：** 只能通过HTML原生属性改变，这些HTML原生属性包括的width和height属性、的size属性。
- **CSS尺寸：** 特指可以通过CSS的width和height或者max-width/min-width和max-height/min-height设置的尺寸，对应盒尺寸中的content box。

这三层结构的计算规则具体如下： （1）如果没有CSS尺寸和HTML尺寸，则使用固有尺寸作为最终的宽高。 （2）如果没有CSS尺寸，则使用HTML尺寸作为最终的宽高。 （3）如果有CSS尺寸，则最终尺寸由CSS属性决定。 （4）如果“固有尺寸”含有固有的宽高比例，同时仅设置了宽度或仅设置了高度，则元素依然按照固有的宽高比例显示。 （5）如果上面的条件都不符合，则最终宽度表现为300像素，高度为150像素。 （6）内联替换元素和块级替换元素使用上面同一套尺寸计算规则。

### 21. 常见的图片格式及使用场景

（1）**BMP**: 无损的，几乎没有进行压缩，所以一般文件较大

（2）**GIF**： 无损的，文件小，同时GIF格式还具有支持动画以及透明的优点。但是GIF格式仅支持8bit的索引色，所以GIF格式适用于对色彩要求不高同时需要文件体积较小的场景

（3）**JPEG**是有损的。JPEG的图片的优点是采用了直接色，得益于更丰富的色彩，JPEG非常适合用来存储照片，与GIF相比，JPEG不适合用来存储企业Logo、线框类的图。因为有损压缩会导致图片模糊，而直接色的选用，又会导致图片文件较GIF更大。

（4）**PNG-8**是无损的、使用索引色的点阵图。PNG是一种比较新的图片格式，PNG-8是非常好的GIF格式替代者，在可能的情况下，应该尽可能的使用PNG-8而不是GIF，因为在相同的图片效果下，**PNG-8具有更小的文件体积**。除此之外，PNG-8还支持透明度的调节，而GIF并不支持。除非需要动画的支持，否则没有理由使用GIF而不是PNG-8。

（5）**PNG-24**是无损的、使用直接色的点阵图。PNG-24的优点在于它压缩了图片的数据，使得同样效果的图片，PNG-24格式的文件大小要比BMP小得多。当然，PNG24的图片还是要比JPEG、GIF、PNG-8大得多。

（6）**SVG**是无损的矢量图。SVG是矢量图意味着SVG图片由直线和曲线以及绘制它们的方法组成。当放大SVG图片时，看到的还是线和曲线，而不会出现像素点。SVG图片在放大时，不会失真，所以它适合用来绘制Logo、Icon等

（7）**WebP**是谷歌开发的一种新图片格式，WebP是同时支持有损和无损压缩的、使用直接色的点阵图。从名字就可以看出来它是为Web而生的，什么叫为Web而生呢？就是说相同质量的图片，WebP具有更小的文件体积。现在网站上充满了大量的图片，如果能够降低每一个图片的文件大小，那么将大大减少浏览器和服务器之间的数据传输量，进而降低访问延迟，提升访问体验。目前只有Chrome浏览器和Opera浏览器支持WebP格式，兼容性不太好。

- 在无损压缩的情况下，相同质量的WebP图片，文件大小要比PNG小26%；

- 在有损压缩的情况下，具有相同图片精度的WebP图片，文件大小要比JPEG小25%~34%；

- WebP图片格式支持图片透明度，一个无损压缩的WebP图片，如果要支持透明度只需要22%的格外文件大小。

### 23. 对CSSSprites的理解

​	CSSSprites（精灵图），将一个页面涉及到的所有图片都包含到一张大图中去，然后利用CSS的 background-image，background-repeat，background-position属性的组合进行背景定位。

**优点**：

- 利用`CSS Sprites`能很好地减少网页的http请求，从而大大提高了页面的性能，这是`CSS Sprites`最大的优点；
- `CSS Sprites`能减少图片的字节，把3张图片合并成1张图片的字节总是小于这3张图片的字节总和。

**缺点**：

- 在图片合并时，要把多张图片有序的、合理的合并成一张图片，还要留好足够的空间，防止板块内出现不必要的背景。在宽屏及高分辨率下的自适应页面，如果背景不够宽，很容易出现背景断裂；

- `CSSSprites`在开发的时候相对来说有点麻烦，需要借助`photoshop`或其他工具来对每个背景单元测量其准确的位置。

- 维护方面：`CSS Sprites`在维护的时候比较麻烦，页面背景有少许改动时，就要改这张合并的图片，无需改的地方尽量不要动，这样避免改动更多的`CSS`，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字节就增加了，还要改动`CSS`。

### 24.什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x, @2x这种图片？

以 iPhone XS 为例，当写 CSS 代码时，针对于单位 px，其宽度为 414px & 896px，也就是说当赋予一个 **DIV元素宽度为 414px**，这个 DIV 就会填满手机的宽度；

而如果有一把尺子来实际测量这部手机的，实际为 **1242\*2688 物理像素**；经过计算可知，1242/414=3，也就是说，在单边上，**一个逻辑像素=3个物理像素**，就说这个屏幕的**像素密度为 3**，也就是常说的 **3 倍屏**。

对于图片来说，为了保证其不失真，1 个图片像素至少要对应一个物理像素，假如原始图片是 500300 像素，那么在 3 倍屏上就要放一个 1500900 像素的图片才能保证 1 个物理像素至少对应一个图片像素，才能不失真。

当然，也可以针对所有屏幕，都只提供最高清图片。虽然低密度屏幕用不到那么多图片像素，而且会因为下载多余的像素造成带宽浪费和下载延迟，但从结果上说能保证图片在所有屏幕上都不会失真。

还可以使用 CSS 媒体查询来**判断不同的像素密度，从而选择不同的图片**:

```css
my-image { background: (low.png); }
@media only screen and (min-device-pixel-ratio: 1.5) {
  #my-image { background: (high.png); }
}
```













## 二、页面布局

### 1. 常见的CSS布局单位

常用的布局单位包括像素（px），百分比（%），em，rem，vm/vh。

#### 1. 像素px

**屏幕分辨率**是指在屏幕的横纵方向上的像素点数量，比如分辨率 1920×1080 意味着水平方向含有 1920 个像素数，垂直方向含有 1080 个像素数。

像素 px 是页面布局的基础，一个像素表示终端（电脑、手机、平板等）屏幕所能显示的最小的区域，像素分为**两种类型**，css 像素和物理像素

- **css 像素**：为 web 开发者提供，在 css 中使用的一个抽象单位；
- **物理像素**：只与设备的硬件密度有关，任何设备的物理像素都是固定的。

#### 2.百分比

​	当浏览器的宽度或者高度发生变化时，通过百分比单位可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，从而实现响应式的效果。一般认为子元素的百分比相对于直接父元素。

#### 3. em和rem

em 和 rem 相对于 px 更具灵活性，它们都是**相对长度单位**，它们之间的区别：**em 相对于父元素**，**rem 相对于根元素**。

- **em：**文本相对长度单位。相对于当前对象内文本的字体尺寸。如果当前行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸（默认16px）。（相对父元素的字体大小倍数）
- **rem：**rem 是 css3 新增的一个相对单位，相对于根元素（html 元素）的 font-size 的倍数。作用：利用 rem 可以实现简单的响应式布局，可以利用 html 元素中字体的大小与屏幕间的比值来设置 font-size 的值，以此实现当屏幕分辨率变化让元素也随之变化。

#### 4.vm/vh

vm/vh 是与视图窗口有关的单位，vw 表示相对于视图窗口的宽度，vh 表示相对于视图窗口高度，除了 vw 和 vh 外，还有 vmin 和 vmax 两个相关的单位。

- vw：相对于视图的宽度，视窗宽度是 100 vw；
- vh：相对于视图的高度，视窗高度是 100 vh；
- vmin：vw 和 vh 中的较小值；
- vmax：vw 和 vh 中的较大值。

**vw/vh** 和百分比很类似，两者的区别：

- 百分比（%）：大部分相对于祖先元素，也有相对于自身的情况比如（border-radius、translate 等）
- vw/vm：相对于视窗的尺寸

### 2. px、em、rem的区别及使用场景

三者的区别：

- px是固定的像素，一旦设置了就无法因为适应页面大小而改变。
- em和rem相对于px更具有灵活性，他们是相对长度单位，其长度不是固定的，更适用于响应式布局。
- em是相对于其父元素来设置字体大小，这样就会存在一个问题，进行任何元素设置，都有可能需要知道他父元素的大小。而rem是相对于根元素，这样就意味着，只需要在根元素确定一个参考值。

**使用场景：**

- 对于只需要适配少部分移动设备，且分辨率对页面影响不大的，使用 px 即可。
- 对于需要适配各种移动设备，使用 rem，例如需要适配 iphone 和 ipad 等分辨率差别比较挺大的设备。

### 3. 两栏布局的实现

**方法一：float + overflow（BFC 原理）**

![image-20211023211955915](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171951263.png)

**方法二：float + margin**

![image-20211023212020396](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171951147.png)

**方法三：flex**

![image-20211023212047368](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171952785.png)

**方法四：grid**

![image-20211023212103591](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171953014.png)

### 4. 三栏布局

#### 如何实现圣杯布局和双飞翼布局

>  圣杯布局和双飞翼布局的目的

- 三栏布局，中间一栏最先加载和渲染（内容最重要）
- 两侧内容固定，中间内容随着宽度自适应
- 一般用于PC网页

>  圣杯布局和双飞翼布局的技术总结

- 使用 float 布局
- 两侧使用 margin 负值，以便和中间内容横向重叠
- 防止中间内容被两侧覆盖，一个用 padding(圣杯布局) 一个用 margin(双飞翼布局)
- 双飞翼布局比圣杯布局简单易懂

#### 圣杯布局

![image-20210809145404758](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171956121.png)



### 5. flex布局

### 概念

`Flexible Box` 简称 `flex`，意为”弹性布局”，可以简便、完整、响应式地实现各种页面布局

采用Flex布局的元素，称为`flex`容器`container`

它的所有子元素自动成为容器成员，称为`flex`项目`item`

注意，设为Flex布局以后，**子元素的float、clear和vertical-align属性将失效**。

容器中默认存在两条轴，主轴和交叉轴，呈90度关系。项目默认沿主轴排列，通过`flex-direction`来决定主轴的方向。每根轴都有起点和终点，这对于元素的对齐非常重要。

**属性**

关于`flex`常用的属性，我们可以划分为容器属性和容器成员属性

容器属性有：

- flex-direction

  ，决定主轴的方向(即项目的排列方向)

  - row（默认值）：主轴为水平方向，起点在左端
  - row-reverse：主轴为水平方向，起点在右端
  - column：主轴为垂直方向，起点在上沿。
  - column-reverse：主轴为垂直方向，起点在下沿
  - ![image-20210910211206987](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203180854409.png)

- flex-wrap

  ，弹性元素永远沿主轴排列，那么如果主轴排不下，通过

  ```
  flex-wrap
  ```

  决定容器内项目是否可换行

  - nowrap（默认值）：不换行
  - wrap：换行，第一行在上方
  - wrap-reverse：换行，第一行在下方
  - 默认情况是不换行，但这里也不会任由元素直接溢出容器，会涉及到元素的弹性伸缩

- **flex-flow**，是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`

- justify-content

  ，定义了项目在主轴上的对齐方式

  - flex-start（默认值）：左对齐
  - flex-end：右对齐
  - center：居中
  - space-between：两端对齐，项目之间的间隔都相等
  - space-around：两个项目两侧间隔相等
  - ![image-20210910211709828](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910211709828.png)

- align-items

  ，定义项目在交叉轴上如何对齐

  - flex-start：交叉轴的起点对齐
  - flex-end：交叉轴的终点对齐
  - center：交叉轴的中点对齐
  - baseline: 项目的第一行文字的基线对齐
  - stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度

- align-content

  ，定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

  - flex-start：与交叉轴的起点对齐
  - flex-end：与交叉轴的终点对齐
  - center：与交叉轴的中点对齐
  - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布
  - space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍
  - stretch（默认值）：轴线占满整个交叉轴
  - ![image-20210910211920251](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910211920251.png)

**容器成员属性如下：**

- **order**，定义项目的排列顺序。数值越小，排列越靠前，默认为0

- **flex-grow**，上面讲到当容器设为`flex-wrap: nowrap;`不换行的时候，容器宽度有不够分的情况，弹性元素会根据`flex-grow`来决定定义项目的放大比例（容器宽度>元素总宽度时如何伸展）默认为`0`，即如果存在剩余空间，也不放大

  - 如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话） ![image-20210910212307091](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910212307091.png)
  - 如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍 ![image-20210910212319402](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910212319402.png)
  - 弹性容器的宽度正好等于元素宽度总和，无多余宽度，此时无论`flex-grow`是什么值都不会生效

- **flex-shrink**，定义了项目的缩小比例（容器宽度<元素总宽度时如何收缩），默认为1，即如果空间不足，该项目将缩小。 如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。 如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。 ![image-20210910212423240](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910212423240.png) 在容器宽度有剩余时，`flex-shrink`也是不会生效的

- **flex-basis**，设置的是元素在主轴上的初始尺寸，所谓的初始尺寸就是元素在`flex-grow`和`flex-shrink`生效前的尺寸。

  浏览器根据这个属性，计算主轴是否有多余空间，默认值为`auto`，即项目的本来大小，如设置了`width`则元素尺寸由`width/height`决定（主轴方向），没有设置则由内容决定。当设置为0的是，会根据内容撑开

  它可以设为跟`width`或`height`属性一样的值（比如350px），则项目将占据固定空间

- **flex**，`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`，也是比较难懂的一个复合属性。

  > 一些属性有：
  >
  > - flex: 1 = flex: 1 1 0%
  > - flex: 2 = flex: 2 1 0%
  > - flex: auto = flex: 1 1 auto
  > - flex: none = flex: 0 0 auto，常用于固定尺寸不伸缩
  >
  > `flex:1` 和 `flex:auto` 的区别，可以归结于`flex-basis:0`和`flex-basis:auto`的区别
  >
  > 当设置为0时（绝对弹性元素），此时相当于告诉`flex-grow`和`flex-shrink`在伸缩的时候不需要考虑我的尺寸
  >
  > 当设置为`auto`时（相对弹性元素），此时则需要在伸缩时将元素尺寸纳入考虑
  >
  > 注意：建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值
  >
  > 最后项目的宽度为 flex-grow + flex-basis，其中 flex-basis:auto 为 100px。

- **align-self**，允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性

  默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

  

### [#](https://alioooooner.github.io/zyhblog/blog/mian-shi-ti/1-css.html#小结-2)小结

flex 布局是 CSS3 新增的一种布局方式，可以通过将一个元素的 display 属性值设置为 flex 从而使它成为一个 flex 容器，它的所有子元素都会成为它的项目。

一个**容器**默认有两条轴：一个是水平的主轴，一个是与主轴垂直的交叉轴。可以使用 flex-direction 来指定主轴的方向。可以使用 justify-content 来指定元素在主轴上的排列方式，使用 align-items 来指定元素在交叉轴上的排列方式。还可以使用 flex-wrap 来规定当一行排列不下时的换行方式。

对于**容器中的项目**，可以使用 order 属性来指定项目的排列顺序，还可以使用f lex-grow 来指定当排列空间有剩余的时候，项目的放大比例，还可以使用 flex-shrink 来指定当排列空间不足时，项目的缩小比例。



## 三、定位与浮动

### 1. 为什么需要清除浮动？

> 浮动定义

非IE浏览器下，容器不设高度且子元素浮动时，容器高度不能被内容撑开。 此时，内容会溢出到容器外面而影响布局。这种现象被称为浮动（溢出）。

> 浮动工作原理

- 浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）
- 浮动元素碰到包含它的边框或者其他浮动元素的边框停留

​	浮动元素可以左右移动，直到遇到另一个浮动元素或者遇到它外边缘的包含框。浮动框不属于文档流中的普通流，当元素浮动之后，不会影响块级元素的布局，只会影响内联元素布局。此时文档流中的普通流就会表现得该浮动框不存在一样的布局模式。当包含框的高度小于浮动框的时候，此时就会出现“高度塌陷”。

> 浮动引起问题

- 父元素的高度无法被撑开，影响与父元素同级的元素
- 与浮动元素同级的非浮动元素会跟随其后
- 若浮动的元素不是第一个元素，则该元素之前的元素也要浮动，否则会影响页面的显示结构

### 2. 清除浮动的方式如下：

1. 给父级div定义`height`属性
2. 最后一个浮动元素之后添加一个空的 div 标签，并添加 `clear:both` （在左右两侧不允许浮动元素）样式
3. 包含浮动元素的父级标签添加 `overflow:hidden`（超出内容不可见） 或者 `overflow:auto`（如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。）
4. 使用`::after`伪元素。由于IE6-7不支持`::after`，使用`zoom:1`触发`hasLayout`

> ::after

```css
.clearfix::after{
    content: "";
    display: block; 
    height: 0;
    clear: both;
}
.clearfix{
    *zoom: 1;
}
```

这种写法的**核心原理**就是通过 ::after 伪元素为在父元素的最后一个子元素后面生成一个内容为空的块级元素，然后通过 clear 将这个伪元素移动到所有它之前的浮动元素的后面，画个图来理解一下。

![image-20211023211328067](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171912497.png)



### 3. 使用clear属性清楚浮动的原理？

使用 clear 属性清除浮动，其语法如下：

```css
clear: none | left | right | both
```

​	如果单看字面意思，clear:left 是“清除左浮动”，clear:right 是“清除右浮动”，实际上，这种解释是有问题的，因为浮动一直还在，并没有清除。

​	官方对 clear 属性解释：“**元素盒子的边不能和前面的浮动元素相邻**”，对元素设置 clear 属性是为了**避免**浮动元素对该元素的影响，而不是清除掉浮动。

​	还需要注意 clear 属性指的是元素盒子的边不能和前面的浮动元素相邻，注意这里“**前面的**”3个字，也就是 clear 属性对**“后面的”**浮动元素是不闻不问的。考虑到 float 属性要么是 left，要么是 right，不可能同时存在，同时由于 clear 属性对“后面的”浮动元素不闻不问，因此，当 clear:left 有效的时候，clear:right 必定无效，也就是此时 clear:left 等同于设置 clear:both；同样地，clear:right 如果有效也是等同于设置 clear:both。由此可见，clear:left 和 clear:right 这两个声明就没有任何使用的价值，至少在 CSS 世界中是如此，直接使用 clear:both 吧。

**一般使用伪元素的方式清除浮动：**

```css
.clear::after{
  content:'';
  display: block; 
  clear:both;
}
```

**clear 属性只有块级元素才有效的**，而 `::after` 等伪元素默认都是内联水平，这就是借助伪元素清除浮动影响时需要设置 `display` 属性值的原因。



### 4. 对BFC的理解

先来看两个相关的**概念**：

- **Box**:Box 是 CSS 布局的对象和基本单位，⼀个页面是由很多个 Box 组成的，这个 Box 就是我们所说的盒模型。
- **Formatting context**：上下⽂格式化，它是页面中的⼀块渲染区域，并且有⼀套渲染规则，它决定了其⼦元素将如何定位，以及和其他元素的关系和相互作⽤。

#### 1. BFC定义

​	块级格式化上下文，它是一个独立的渲染区域，只有块级盒子参与，它规定了内部的块级盒子如何布局，并且与这个区域外部毫不相干。

![image-20211023170045265](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171917616.png)

#### 2. BFC渲染规则

- 内部的盒子会在垂直方向，一个接一个地放置；
- 盒子垂直方向的距离由 margin 决定，属于同一个 BFC 的两个相邻盒子的 margin 会发生重叠；
- 每个元素的 margin 的左边，与包含块 border 的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此；
- BFC 的区域不会与 float 盒子重叠；
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
- 计算 BFC 的高度时，浮动元素也参与计算。

#### 3. 创建BFC的条件

- 根元素：html
- 非溢出的可见元素：overflow 不为 visible
- 设置浮动：float 属性不为 none
- 设置定位：position 为 absolute 或 fixed
- 定义成块级的非块级元素：display: inline-block/table-cell/table-caption/flex/inline-flex/grid/inline-grid；

#### 4. BFC的应用场景

- **解决margin的重叠问题**：由于BFC是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个BFC，就解决了 margin 重叠的问题。
- **解决高度塌陷的问题**：在对子元素设置浮动后，父元素会发生高度塌陷，也就是父元素的高度变为0。解决这个问题，只需要把父元素变成一个 BFC。常用的办法是给父元素设置`overflow:hidden`。
- **创建自适应两栏布局**：可以用来创建自适应两栏布局：左边的宽度固定，右边的宽度自适应。

> 自适应两栏布局

```html
.left{
     width: 100px;
     height: 200px;
     background: red;
     float: left;
 }
 .right{
     height: 300px;
     background: blue;
     overflow: hidden;
 }
 
<div class="left"></div>
<div class="right"></div>
```

左侧设置`float:left`，右侧设置`overflow: hidden`。这样右边就触发了BFC，BFC 的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠，实现了自适应两栏布局。



### 5. 什么是margin重叠问题？如何解决？

**问题描述：**

​	两个块级元素的上外边距和下外边距可能会合并（折叠）为一个外边距，其大小会取其中外边距值大的那个，这种行为就是外边距折叠。需要注意的是，**浮动的元素和绝对定位**这种脱离文档流的元素的外边距不会折叠。重叠只会出现在**垂直方向**。

**计算原则：**

折叠合并后外边距的计算原则如下：

- 如果两者都是正数，那么就去最大者
- 如果是一正一负，就会正值减去负值的绝对值
- 两个都是负值时，用0减去两个中绝对值大的那个

**解决办法：**

对于折叠的情况，主要有两种：**兄弟之间重叠**和**父子之间重叠**

（1）兄弟之间重叠

- 底部元素变为行内盒子：`display: inline-block`
- 底部元素设置浮动：`float`
- 底部元素的position的值为`absolute/fixed`

（2）父子之间重叠

- 父元素加入：`overflow: hidden`
- 父元素添加透明边框：`border:1px solid transparent`
- 子元素变为行内盒子：`display: inline-block`
- 子元素加入浮动属性或定位

### 6. 层叠上下文

#### 1. 层叠上下文定义

​	层叠上下文是 HTML 中一个三位的概念，除了 x、y 轴，众 HTML 元素依据自己定义的属性优先级在 Z 轴上按照一定的顺序排开，就是层叠上下文要描述的东西。

​	一个元素含有层叠上下文（也就是说它是层叠上下文元素），我们可以理解为这个元素在 z 轴上就离观察者更近。

#### 2. 层叠等级

1. 普通元素的层叠等级优先由其所在的层叠上下文决定。
2. 层叠等级的比较只有在当前层叠上下文元素中才有意义。不同层叠上下文中比较层叠等级是没有意义的。

#### 3. 如何产生“层叠上下文”

其实，层叠上下文也基本上是有一些特定的CSS属性创建的，一般有3种方法：

1. HTML 中的根元素`<html></html>`本身就具有层叠上下文，称为“根层叠上下文”。
2.  普通元素设置 position 属性为非 static 值并设置 z-index 属性为具体数值，产生层叠上下文。
3.  CSS3 中的新属性也可以产生层叠上下文。

#### 4. 层叠顺序

层叠顺序，英文称作 stacking order，表示元素发生层叠时有着特定的垂直显示顺序。下面是盒模型的层叠规则：

![image-20210910225208629](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171928145.png)

对于上图，由上到下分别是：

（1）背景和边框：建立当前层叠上下文元素的背景和边框。

（2）负的z-index：当前层叠上下文中，z-index属性值为负的元素。

（3）块级盒：文档流内非行内级非定位后代元素。

（4）浮动盒：非定位浮动元素。

（5）行内盒：文档流内行内级非定位后代元素。

（6）z-index:0：层叠级数为0的定位元素。

（7）正z-index：z-index属性值为正的定位元素。

**注意:** 当定位元素 z-index:auto，生成盒在当前层叠上下文中的层级为 0，不会建立新的层叠上下文，除非是根元素。

#### 5. 如何比较两个元素的层叠等级？

- 在同一个层叠上下文中，比较两个元素就是按照上图的介绍的层叠顺序进行比较。
- 如果不在同一个层叠上下文中的时候，那就需要比较两个元素分别所处的层叠上下文的等级。
- 如果两个元素都在同一个层叠上下文，且层叠顺序相同，则在 HTML 中定义越后面的层叠等级越高

### 7. position的属性有哪些，区别是什么？

position有以下属性值：

| 属性值   | 概述                                                         |
| -------- | ------------------------------------------------------------ |
| absolute | 生成绝对定位的元素，相对于static定位以外的一个父元素进行定位。元素的位置通过left、top、right、bottom属性进行规定。 |
| relative | 生成相对定位的元素，相对于其原来的位置进行定位。元素的位置通过left、top、right、bottom属性进行规定。 |
| fixed    | 生成绝对定位的元素，指定元素相对于屏幕视⼝（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变，⽐如回到顶部的按钮⼀般都是⽤此定位⽅式。 |
| static   | 默认值，没有定位，元素出现在正常的文档流中，会忽略 top, bottom, left, right 或者 z-index 声明，块级元素从上往下纵向排布，⾏级元素从左向右排列。 |
| inherit  | 规定从父元素继承position属性的值                             |
| sticky   | 粘性定位，该定位基于用户滚动的位置。 它的行为就像 position:relative; 而当页面滚动超出目标区域时，它的表现就像 position:fixed;，它会固定在目标位置。 |

前面三者的定位方式如下：

- **relative：**元素的定位永远是相对于元素自身位置的，和其他元素没关系，也不会影响其他元素。

  ![image-20210910225446664](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910225446664.png)

- **fixed：**元素的定位是相对于 window （或者 iframe）边界的，和其他元素没有关系。但是它具有破坏性，会导致其他元素位置的变化。

  ![image-20210910225500666](https://gitee.com/dadadaxyx/my-images/raw/master/image-20210910225500666.png)

- **absolute：**元素的定位相对于前两者要复杂许多。如果为 absolute 设置了 top、left，浏览器会根据什么去确定它的纵向和横向的偏移量呢？答案是浏览器会递归查找该元素的所有父元素，如果找到一个设置了`position:relative/absolute/fixed`的元素，就以该元素为基准定位，如果没找到，就以浏览器边界定位。

  ![image-20210910225513066](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171932917.png)

  ![image-20210910225525205](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203171932796.png)

### 8. display、float、position的关系

（1）首先判断display属性是否为none，如果为none，则position和float属性的值不影响元素最后的表现。

（2）然后判断position的值是否为absolute或者fixed，如果是，则float属性失效，并且display的值应该被设置为table或者block，具体转换需要看初始转换值。

（3）如果position的值不为absolute或者fixed，则判断float属性的值是否为none，如果不是，则display的值则按上面的规则转换。注意，如果position的值为relative并且float属性的值存在，则relative相对于浮动后的最终位置定位。

（4）如果float的值为none，则判断元素是否为根元素，如果是根元素则display属性按照上面的规则转换，如果不是，则保持指定的display属性值不变。

​	总的来说，可以把它看作是一个类似优先级的机制，"position:absolute"和"position:fixed"优先级最高，有它存在的时候，浮动不起作用，'display'的值也需要调整；其次，元素的'float'特性的值不是"none"的时候或者它是根元素的时候，调整'display'的值；最后，非根元素，并且非浮动元素，并且非绝对定位的元素，'display'特性值同设置值。

### 9. absolute与fixed共同点与不同点

**共同点：**

- 改变行内元素的呈现方式，将display置为inline-block
- 使元素脱离普通文档流，不再占据文档物理空间
- 覆盖非定位文档元素

**不同点：**

- abusolute与fixed的根元素不同，abuselute的根元素可以设置，fixed根元素是浏览器。
- 在有滚动条的页面中，absolute会跟着父元素进行移动，fixed固定在页面的具体位置。

### 10. 对sticky定位的理解

sticky 英文字面意思是粘贴，所以可以把它称之为粘性定位。语法：**position: sticky;** 基于用户的滚动位置来定位。

粘性定位的元素是依赖于用户的滚动，在 **position:relative** 与 **position:fixed** 定位之间切换。它的行为就像 **position:relative;** 而当页面滚动超出目标区域时，它的表现就像 **position:fixed;**，它会固定在目标位置。元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。这个特定阈值指的是 top, right, bottom 或 left 之一，换言之，指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。否则其行为与相对定位相同。



## 四、场景应用

### 1. 实现一个三角形

CSS绘制三角形主要用到的是border属性，也就是边框。

平时在给盒子设置边框时，往往都设置很窄，就可能误以为边框是由矩形组成的。实际上，border属性是右三角形组成的，下面看一个例子：

```css
div {
    width : 0;
    height: 0;
    border: 100px solid;
    border-color: orange blue red green;
}
```

将元素的长宽都设置为0，显示出来的效果是这样的：

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203151117464.webp)

三角型： 

```css
div {
    width : 0;
    height: 0;
    border-left: 50px solid red;
    border-top: 50px solid transparent;
    border-bottom: 50px solid transparent;
}
```

:::tip

transparent: 透明属性

:::

总体的原则就是通过上下左右边框来控制三角形的方向，用边框的宽度比来控制三角形的角度。

### 2. 实现一个扇形

用CSS实现扇形的思路和三角形基本一致，就是多了一个圆角的样式，实现一个90°的扇形：

```css
div{
    border: 100px solid transparent;
    width: 0;
    heigt: 0;
    border-radius: 100px;
    border-top-color: red;
}
```

![img](https://gitee.com/ljcdzh/my_pic/raw/master/img/202203151153085.webp)

### 3. 水平居中对齐

#### （1）绝对定位 + transform（不定）

​	利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过translate来调整元素的中心点到页面的中心。该方法需要**考虑浏览器兼容问题。**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .children-box {
            position: absolute;
            background-color: yellow;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    </style>
</head>

<body>
    <div id="app">
        <div class="children-box">111111</div>
    </div>
</body>

</html>
```

#### （2）flex布局（不定）

​	使用flex布局，通过align-items:center和justify-content:center设置容器的垂直和水平方向上为居中对齐，然后它的子元素也可以实现垂直和水平的居中。该方法要**考虑兼容的问题**，该方法在移动端用的较多：

```css
.parent {
    display: flex;
    justify-content:center;
    align-items:center;
}
```

#### （3）绝对定位 + margin:auto（定）

​	利用绝对定位，设置四个方向的值都为0，并将margin设置为auto，由于宽高固定，因此对应方向实现平分，可以实现水平和垂直方向上的居中。该方法适用于**盒子有宽高**的情况：

```css
.parent {
    position: relative;
}
 
.child {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
```

#### （4）绝对定位 + margin负值(定)

​	利用绝对定位，先将元素的左上角通过top:50%和left:50%定位到页面的中心，然后再通过margin负值来调整元素的中心点到页面的中心。该方法适用于**盒子宽高已知**的情况。

```css
.parent {
    position: relative;
}
 
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -50px;     /* 自身 height 的一半 */
    margin-left: -50px;    /* 自身 width 的一半 */
}

```



#### （5）grid布局+ margin:auto(不定)

```css
<template>
    <div id="app">
        <div class="box">
            <div class="children-box"></div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: grid;
}
.children-box {
    width: 100px;
    height: 100px;
    background: yellow;
    margin: auto;
}
</style>

```

#### （6）grid + flex布局

```html
<template>
    <div id="app">
        <div class="box">
            <div class="children-box">11111111</div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: grid;
}
.children-box {
    background: yellow;
    align-self: center;
    justify-self: center;
}
</style>
```

#### （7）table-cell

```js
<template>
    <div id="app">
        <div class="box">
            <div class="children-box">111111</div>
        </div>
    </div>
</template>
<style type="text/css">
.box {
    width: 200px;
    height: 200px;
    border: 1px solid red;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.children-box {
   background: yellow;
   display: inline-block;
}
</style>
```







## 五、性能

### 1. 如何开启硬件加速GPU

#### 1. GPU是什么，作用是什么？

​	GPU 是图形处理器，它帮助 CPU 从图形处理的任务解放出来，让 CPU 可以执行更多其他的系统任务，这样可以大大提高计算机的整体性能。

#### 2. 硬件加速是什么？

​	就是将浏览器的渲染过程交给 GPU 处理，而不是使用自带的比较慢的渲染器。这样就可以使得 animation 和 transition 更加顺畅。

我们可以在浏览器中用 CSS 开启硬件加速，使 GPU 发挥功能，从而提升性能。

#### 3. 硬件加速原理

​	浏览器接收到页面文档后，会将文档中的标记语言解析为DOM树。DOM树和CSS结合后形成浏览器构建页面的渲染树。渲染树中包含大量的渲染元素，每个渲染元素会被分到一个图层中，每个图层又会被加载到GPU形成渲染纹理，而图层在GPU中transform是不会触发repaint的，最终这些使用transform的图层都会由独立的合成器进程进行处理

CSS transform会创建了一个新的复合图层，可以被GPU直接用来执行transform操作。

> 浏览器什么时候会创建一个独立的符合图层呢？

- 3D 或者 CSS transform
- `video` 和 `canvas` 标签
- css filters
- 元素覆盖时，比如使用了 z-index 属性

> 为什么硬件加速会使页面流畅

​	因为 transform 属性不会触发浏览器的 repaint（重绘），而绝对定位 absolute 中的 left 和 top 则会一直触发 repaint（重绘）。

> 为什么transform没有触发repaint

简而言之，transform 动画 GPU 控制，支持硬件加载，并不需要软件方面的渲染。

​	**并不是所有的 CSS 属性都能触发 GPU 的硬件加速，事实上只有少数的属性可以，比如 transform、opacity、filter。**

#### 4. 如何用CSS开启硬件加速

​	使用“欺骗“浏览器来开启硬件加速。浏览器在处理下面的 css 的时候，会使用 GPU 渲染。

- transform（当 3D 变化的样式出现时会使用 GPU 加速）
- opacity（设置透明度）
- filter(设置图片灰度)
- will-change

:::tip

​	采用 transform: translateZ(0) 采用 transform: translate3d(0, 0, 0) 使用 CSS 的 will-change属性。 will-change 可以设置为opacity、transform、top、left、bottom、right。

:::



::: warning

​	注意！层爆炸，由于某些原因可能导致产生大量不在预期内的合成层，虽然有浏览器的层压缩机制，但是也有很多无法进行压缩的情况，这就可能出现层爆炸的现象（简单理解就是，很多不需要提升为合成层的元素因为某些不当操作成为了合成层）。解决层爆炸的问题，最佳方案是打破 overlap 的条件，也就是说让其他元素不要和合成层元素重叠。简单直接的方式：使用 3D 硬件加速提升动画性能时，最好给元素增加一个 z-index 属性，人为干扰合成的排序，可以有效减少创建不必要的合成层，提升渲染性能，移动端优化效果尤为明显。

:::
