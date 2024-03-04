<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">Admin Panel</router-link>
                <div class="menu-icon" @click="navOpen = !navOpen">
                    <div :class="{ 'change': navOpen }" class="bar"></div>
                    <div :class="{ 'change': navOpen }" class="bar"></div>
                    <div :class="{ 'change': navOpen }" class="bar"></div>
                </div>
                <div :class="navOpen ? 'show-nav navbar-collapse' : 'collapse navbar-collapse'" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'UserLogin' }">Login</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :to="{ name: 'GameWorld' }">Game World</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <router-view/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navOpen: false,
            loggedInUser: null
        };
    },
    created() {
        this.loggedInUser = this.$store.state.loggedInUser;
    }
};
</script>

<style>
/* Add your existing styles here */

/* Add these new styles */
.menu-icon {
    display: none;
    cursor: pointer;
}

.bar {
    width: 35px;
    height: 5px;
    background-color: #fff;
    margin: 6px 0;
    transition: 0.4s;
}

/* Rotate first bar */
.change .bar:nth-child(1) {
    transform: rotate(-45deg) translate(-9px, 6px);
}

/* Fade out the second bar */
.change .bar:nth-child(2) {
    opacity: 0;
}

/* Rotate last bar */
.change .bar:nth-child(3) {
    transform: rotate(45deg) translate(-8px, -8px);
}

@media screen and (max-width: 992px) {
    .menu-icon {
        display: block;
    }

    .navbar-collapse {
        position: absolute;
        top: 56px;
        right: 0;
        background-color: #343a40;
        width: 100%;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .show-nav {
        transform: translateX(0);
    }
}
</style>