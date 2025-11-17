// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-bookshelf",
          title: "bookshelf",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/plotly/";
          
        },
      },{id: "post-a-post-with-image-galleries",
        
          title: "a post with image galleries",
        
        description: "this is what included image galleries could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/photo-gallery/";
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/giscus-comments/";
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/assets/pdf/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/diagrams/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/twitter/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/formatting-and-links/";
          
        },
      },{id: "books-what-is-life",
          title: 'What Is Life?',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/what_is_life/";
            },},{id: "books-a-rose-for-emily",
          title: 'A Rose for Emily',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/rose_for_emily/";
            },},{id: "books-mateo-falcone",
          title: 'Mateo Falcone',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/mateo_falcone/";
            },},{id: "books-the-snows-of-kilimanjaro",
          title: 'The Snows of Kilimanjaro',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/Kilimanjaro/";
            },},{id: "books-лёгкое-дыхание",
          title: 'Лёгкое дыхание',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/light_breathing/";
            },},{id: "books-el-jardín-de-senderos-que-se-bifurcan",
          title: 'El jardín de senderos que se bifurcan',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/garden/";
            },},{id: "books-οἰδίπους-ἐπὶ-κολωνῷ",
          title: 'Οἰδίπους ἐπὶ Κολωνῷ',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/oedipus/";
            },},{id: "books-ἀντιγόνη",
          title: 'Ἀντιγόνη',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/antigone/";
            },},{id: "books-πέρσαι",
          title: 'Πέρσαι',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/persians/";
            },},{id: "books-el-informe-de-brodie",
          title: 'El informe de Brodie',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/brodie/";
            },},{id: "books-carmen",
          title: 'Carmen',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/carmen/";
            },},{id: "books-colomba",
          title: 'Colomba',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/colomba/";
            },},{id: "books-federigo",
          title: 'Federigo',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/fedrigo/";
            },},{id: "books-l-âme-en-purgatoire",
          title: 'L’Âme en purgatoire',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/purgatoire/";
            },},{id: "books-tamango",
          title: 'Tamango',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/tamango/";
            },},{id: "books-le-vase-étrusque",
          title: 'Le Vase étrusque',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/vase/";
            },},{id: "books-quo-vadis",
          title: 'Quo vadis',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/qvo_vadis/";
            },},{id: "books-la-vénus-d-ille",
          title: 'La Vénus d’Ille',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/venus/";
            },},{id: "books-historia-universal-de-la-infamia",
          title: 'Historia universal de la infamia',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/bad/";
            },},{id: "books-et-dukkehjem",
          title: 'Et Dukkehjem',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/dolls_house/";
            },},{id: "books-le-città-invisibili",
          title: 'Le città invisibili',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/invisible_cities/";
            },},{id: "books-das-parfum",
          title: 'Das Parfum',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/perfume/";
            },},{id: "books-black-water",
          title: 'Black Water',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/black_water/";
            },},{id: "books-翦商",
          title: '翦商',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/jianshang/";
            },},{id: "books-zombie",
          title: 'Zombie',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/zombie/";
            },},{id: "books-yes-prime-minister",
          title: 'Yes, Prime Minister',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/ypm/";
            },},{id: "books-多極亞洲中的唐朝",
          title: '多極亞洲中的唐朝',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/tang/";
            },},{id: "books-萬歷十五年",
          title: '萬歷十五年',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/wanli/";
            },},{id: "books-bad-blood",
          title: 'Bad Blood',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/bad_blood/";
            },},{id: "books-金閣寺",
          title: '金閣寺',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/golden_pav/";
            },},{id: "books-古文观止",
          title: '古文观止',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/guwen/";
            },},{id: "books-棋王-树王-孩子王",
          title: '棋王·树王·孩子王',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/chess_king/";
            },},{id: "books-the-lady-tasting-tea",
          title: 'The Lady Tasting Tea',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/lady/";
            },},{id: "books-史记",
          title: '史记',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/history/";
            },},{id: "books-pedro-páramo",
          title: 'Pedro Páramo',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/pedro/";
            },},{id: "books-楚辞",
          title: '楚辞',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/chuci/";
            },},{id: "books-bottle-of-lies",
          title: 'Bottle of Lies',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/bottle_of_lies/";
            },},{id: "books-六至九世纪中国政治史",
          title: '六至九世纪中国政治史',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/politics_in_6_9/";
            },},{id: "books-故事新编",
          title: '故事新编',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/old_tales/";
            },},{id: "news-the-summer-after-sophomore-year-marked-a-milestone-i-joined-prof-kai-kang-s-group-and-began-my-research-journey-smile",
          title: 'The summer after sophomore year marked a milestone — I joined Prof. Kai...',
          description: "",
          section: "News",},{id: "news-an-unexpected-byproduct-of-an-ongoing-project",
          title: 'An unexpected byproduct of an ongoing project',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-excited-to-begin-my-summer-research-internship-at-emory-sparkles",
          title: 'Excited to begin my summer research internship at Emory! :sparkles:',
          description: "",
          section: "News",},{id: "news-had-the-chance-to-present-my-recent-progress-on-single-cell-twas-at-the-encore-lab-meeting",
          title: 'Had the chance to present my recent progress on single-cell TWAS at the...',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_4/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%6F%75@%65%78%61%6D%70%6C%65.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-inspire',
        title: 'Inspire HEP',
        section: 'Socials',
        handler: () => {
          window.open("https://inspirehep.net/authors/1010907", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-custom_social',
        title: 'Custom_social',
        section: 'Socials',
        handler: () => {
          window.open("https://www.alberteinstein.com/", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
