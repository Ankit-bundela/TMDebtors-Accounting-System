const myStyles = (theme) => ({
    mainContainer: {
        flexGrow: "1"
    },
    contentSection: {
        padding: "50px"
    },
    appBarSpacer: theme.mixins.toolbar,
    appBar: { zIndex: theme.zIndex.drawer + 1 },
    drawer: {
        zIndex: theme.zIndex.appBar - 1,  // Sidebar ko Menubar ke neeche rakhna
    }
});

export default myStyles;
