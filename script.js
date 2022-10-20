(function () {

  const app = document.querySelector("#app");

  function renderLinks() {
    const links = document.createElement("div");
    const home = document.createElement("a");
    home.href = "#home";
    home.innerText = "Home";
    const about = document.createElement("a");
    about.href = "#about";
    about.innerText = "About";
    links.append(home, about);
    app.appendChild(links);
  }

  const Home = {
    render() {
      const component = document.createElement("div");
      component.id = this.name;
      const heading = document.createElement("h1");
      heading.innerText = "Hello World";
      const someText = document.createElement("p");
      someText.innerText = "Lopem ipsum dolor sit amet this is home page";
      const goToLinkButton = document.createElement("button");
      goToLinkButton.innerText = "Go to product number 1323";
      goToLinkButton.addEventListener("click", () => goTo('#getProduct|{"productId":1323}'));
      component.appendChild(heading);
      component.appendChild(someText);
      component.appendChild(goToLinkButton);
      app.appendChild(component);
    },
    unmount() {
      const component = document.querySelector(`#${this.name}`);
      component.remove();

    }
  }

  const About = {
    defaultState: {
      count: 4
    },
    state: {
      count: 4
    },
    methods: {
      addCounter() {
        About.state.count++;
        console.log(About.state.count);
        About.update();
      }
    },
    intervals: {
      counterSetter: null
    },
    // addCounter() {
    //   this.state.count++;
    //   console.log(this.state.count);
    //   this.update();
    // },
    render() {
      const component = document.createElement("div");
      component.id = this.name;
      const heading = document.createElement("h1");
      heading.innerText = "This is about";
      const someText = document.createElement("p");
      someText.innerText = "Lopem ipsum dolor sit amet this is about page";
      const counter = document.createElement("p");
      counter.innerText = `Clicked ${this.state.count} times`;
      counter.id = "counter";
      const buttonPlus = document.createElement("button");
      buttonPlus.innerText = "+";
      buttonPlus.addEventListener("click", this.methods.addCounter);
      // buttonPlus.addEventListener("click", () => this.addCounter());
      component.append(heading, someText, counter, buttonPlus);
      app.appendChild(component);
      this.intervals.counterSetter = setInterval(this.methods.addCounter, 1000);
    },
    update() {
      const counter = document.querySelector("#counter");
      counter.innerText = `Clicked ${this.state.count} times`;
    },
    unmount() {
      this.state = {...this.state, ...this.defaultState};
      clearInterval(this.intervals.counterSetter);
      const component = document.querySelector(`#${this.name}`);
      component.remove();
    }
  }

  const GetProduct = {
    render() {
      const {productId} = currentParams;
      const component = document.createElement("div");
      component.id = this.name;
      const heading = document.createElement("h1");
      heading.innerText = `Info about product №${productId}`;
      const someText = document.createElement("p");
      someText.innerText = "Lopem ipsum dolor sit amet this is about page";
      component.appendChild(heading);
      component.appendChild(someText);
      app.appendChild(component);
    },
    unmount() {
      const component = document.querySelector(`#${this.name}`);
      component.remove();

    }
  }

  const routes = [
    {url: "", component: Home},
    {url: "home", component: Home},
    {url: "about", component: About},
    {url: "getProduct", component: GetProduct}
  ];
  let currentRouteComponent;
  let currentParams = {};

  function init() {
    window.addEventListener("popstate", routing);
  }

  function goTo(url) {
    const link = document.createElement("a");
    link.href = url;
    link.click();
  }

  function routing() {
    const splitted = window.location.hash.substr(1).split(/\|(.*)/s);
    const hash = splitted[0];
    const params = splitted[1]?.replaceAll("%22", '"') || "";
    let parsedParams = {};
    try {
      parsedParams = JSON.parse(params);
      console.log("was able to parse parameters: ", parsedParams);
    } catch (e) {
      console.log("Unable to parse params")
    }
    currentParams = parsedParams;
    console.log("hash=", hash);
    console.log("params=", params);
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.url === hash) {
        console.log("found route!! [", route.component, "]")

        if (currentRouteComponent) {
          currentRouteComponent.unmount();
        }
        currentRouteComponent = route.component;
        route.component.render();
        console.log("currentParams", currentParams);
        break;
      }
    }

  }

  init();
  renderLinks();
  routing();
})();