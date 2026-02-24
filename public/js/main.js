var RDLviewer_main = (function () {
    var self = {}





    self.onLoaded = function () {


        $("#lateralPanelDiv").load("/plugins/sls-rdl-viewer/html/leftPanel.html", function (err) {

            $("#sls-rdl-viewer-tabsDiv").tabs({})
            self.loadPackagesTree()
        })

        $("#graphDiv").load("/plugins/sls-rdl-viewer/html/rightPanel.html", function (err) {
        })

    }

    /**
     * Initialise le cache des nœuds par type Window/Pave pour toutes les classes
     */


    self.loadPackagesTree = function () {
        return;
        var jstreeData = []
        var uniqueNodes = {}
        jstreeData.push(
            {
                id: self.currentSource,
                text: self.currentSource,
                parent: "#",
                data: {
                    type: "source",
                    id: "self.currentSource",
                    label: "self.currentSource",
                    parent: "#",
                    //tabId: options.tabId,
                },
            })

        async.eachSeries(Object.keys(self.assets), function (asset, callbackEach) {
            if (!Config.sources[self.assets[asset].source]) {
                return callbackEach()
            }


            jstreeData.push(
                {
                    id: asset,
                    text: asset,
                    parent: "Assets",
                    data: {
                        type: self.breakdownClasses[0],
                        source: self.assets[asset].source,
                        id: asset,
                        label: asset,
                        parent: "Assets",
                        //tabId: options.tabId,
                    },
                })
            var options = {depth: 1}
            var containerId = self.assets[asset].topContainerId
            var source = self.assets[asset].source
            self.currentSource = source
            Containers_query.getContainerDescendants(source, containerId, options, function (err, result) {


                result.results.bindings.forEach(function (item) {
                    if (!uniqueNodes[item.parent.value]) {
                        uniqueNodes[item.parent.value] = 1
                        var label = item.parentLabel ? item.parentLabel.value : Sparql_common.getLabelFromURI(item.parent.value)
                        /*  jstreeData.push(
                              {
                                  id: item.parent.value,
                                  text: label,
                                  parent: asset,
                                  data: {
                                      type: self.breakdownClasses[0],
                                      source: source,
                                      id: item.parent.value,
                                      label: label,
                                      parent: asset,
                                      //tabId: options.tabId,
                                  },
                              })*/
                    }
                    if (!uniqueNodes[item.member.value]) {
                        uniqueNodes[item.member.value] = 1
                        var label = item.memberLabel ? item.memberLabel.value : Sparql_common.getLabelFromURI(item.member.value)
                        jstreeData.push(
                            {
                                id: item.member.value,
                                text: label,
                                parent: asset,//item.parent.value,
                                data: {
                                    type: self.breakdownClasses[1],
                                    source: source,
                                    id: item.member.value,
                                    label: label,
                                    parent: asset//item.parent.value,
                                    //tabId: options.tabId,
                                },
                            })
                    }

                })


                callbackEach()
            })

        }, function (err) {
            var options = {
                openAll: true,
                selectTreeNodeFn: function (event, obj) {
                    self.currentBreakdownTreeNode = obj.node
                    if (obj.node.parents.length <= 2)//assets levels (Assets and assets names)
                    {
                        return;
                    }
                    Containers_tree.listContainerResources(obj.node, self.parkagesJstreeDivId);
                    // self.showParamsDialog(obj.node)


                }
                ,
                contextMenu: function (node, x) {
                    var items = {};
                    FilterWidget.allAssetsCBX = false;
                    if (node.id == "Assets") {
                        FilterWidget.allAssetsCBX = true;
                    }
                    items.notificationBacklogHistory = {

                        label: "Notifications Backlog History",
                        action: function (_e) {
                            self.currentTool = "notificationBacklogHistory"
                            self.currentTargetClass = "Notification"
                            FilterWidget.showParamsDialog(self.currentBreakdownTreeNode, self.currentTargetClass, 'backlog')


                        },
                    };
                    if (node.id != "Assets") {
                        items.notificationHistory = {

                            label: "Notifications History",
                            action: function (_e) {
                                self.currentTargetClass = "Notification"
                                FilterWidget.showParamsDialog(self.currentBreakdownTreeNode, self.currentTargetClass, 'history')

                            },
                        };
                        items.workorderHistory = {
                            label: "Workorders History",
                            action: function (_e) {
                                self.currentTargetClass = "Workorder"
                                FilterWidget.showParamsDialog(self.currentBreakdownTreeNode, self.currentTargetClass, 'history')
                            },
                        };
                        items.NotificationsList = {
                            label: "Notifications List",
                            action: function (_e) {
                                self.currentTargetClass = "Notification"
                                FilterWidget.showParamsDialog(self.currentBreakdownTreeNode, self.currentTargetClass, "list")
                            },

                        }
                        items.workorderList = {
                            label: "Workorders List",
                            action: function (_e) {
                                self.currentTargetClass = "Workorder"
                                FilterWidget.showParamsDialog(self.currentBreakdownTreeNode, self.currentTargetClass, "list")
                            },
                        }
                    }
                    return items;

                }


            }
            JstreeWidget.loadJsTree(self.self.rdlJstreeDiv, jstreeData, options)
            // Containers_tree.drawTree(self.parkagesJstreeDivId, self.currentSource, "#",jstreeData, options);
        })
    }


    return self;
})();
export default RDLviewer_main;
window.RDLviewer_main = RDLviewer_main