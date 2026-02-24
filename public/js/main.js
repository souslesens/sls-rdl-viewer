import SparqlQueries from "./sparqlQueries.js";
var RDLviewer_main = (function () {
    var self = {}




    self.currentSource = null;
    self.rdlJstreeDiv = "rdl-viewer-jstreeDiv";
    self.referenceOntology = "ISO-14224-IOF"
    self.currentSource = "ISO-14224-IOF-RDL";

    self.onLoaded = function () {


        $("#lateralPanelDiv").load("/plugins/sls-rdl-viewer/html/leftPanel.html", function (err) {

            $("#rdl-viewer-tabsDiv").tabs({})
            self.loadRdlJsTree()
        })
        $("#graphDiv").load("/plugins/sls-rdl-viewer/html/rightPanel.html", function (err) {

            $("#rdl-viewer-tabsDiv").tabs({})
            self.loadRdlJsTree()
        })


    }

    /**
     * Initialise le cache des nœuds par type Window/Pave pour toutes les classes
     */


    self.loadRdlJsTree = function () {


        SparqlQueries.getRefOntologyClasses(self.referenceOntology, function(err, result) {
if(err)
    return alert(err.responseText || err)

            var jstreeData = []
            var uniqueNodes = {}
            jstreeData.push(
                {
                    id: self.currentSource,
                    text: self.currentSource,
                    parent: "#",
                    data: {
                        type: "source",
                        id: self.currentSource,
                        label: self.currentSource,
                        parent: "#",

                    },

                })


            result.forEach(function(item) {
                if(!uniqueNodes[item.id.value]) {
                    uniqueNodes[item.id.value]=1
                    jstreeData.push(
                        {
                            id: item.id.value,
                            text: item.label.value,
                            parent: self.currentSource,
                            data: {

                                source: self.referenceOntology,
                                id: item.id.value,
                                label: item.label.value,
                                parent: self.currentSource,
                                //tabId: options.tabId,
                            },
                        })
                }
               if(item.subClass && !uniqueNodes[item.subClass.value]) {
                   uniqueNodes[item.subClass.value] = 1
                   jstreeData.push(
                       {
                           id: item.subClass.value,
                           text: item.subClassLabel.value,
                           parent: item.id.value,
                           data: {

                               source: self.referenceOntology,
                               id: item.subClass.value,
                               label: item.subClassLabel.value,
                               parent: item.id.value,
                               //tabId: options.tabId,
                           },
                       })
               }

            })

                var options = {
                    openAll: true,
                    selectTreeNodeFn: function (event, obj) {
                        self.currentBreakdownTreeNode = obj.node

                       RDLviewer_main.listClassIndividuals(obj.node,);
                        RDLviewer_main.showNodeInfos(obj.node);
                        // self.showParamsDialog(obj.node)


                    }


                    ,
                    contextMenu: function (node, x) {
                        var items = {};

                        return items;
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

                        }
                        return items;

                    }


                }
                JstreeWidget.loadJsTree(self.rdlJstreeDiv, jstreeData, options)
                // Containers_tree.drawTree(self.parkagesJstreeDivId, self.currentSource, "#",jstreeData, options);

        })
    }

    self.listClassIndividuals=function(node){
        SparqlQueries.getClassIndividuals(self.currentSource,node.data.id,function( err,result){
            if(err)
                return alert(err.responseText || err)

            var jstreeData = []
            var uniqueNodes = {}
            result.forEach(function(item) {
                if(!uniqueNodes[item.id.value]) {
                    uniqueNodes[item.id.value]=1
                    jstreeData.push(
                        {
                            id: item.id.value,
                            text: item.label.value,
                            parent: node.id,
                            data: {

                                source: self.currentSource,
                                id: item.id.value,
                                label: item.label.value,
                                parent: node.id,
                                //tabId: options.tabId,
                            },
                        })
                }
                if(item.part && !uniqueNodes[item.part.value]) {
                    uniqueNodes[item.part.value] = 1
                    jstreeData.push(
                        {
                            id: item.part.value,
                            text: item.partLabel.value,
                            parent: item.id.value,
                            data: {

                                source: self.currentSource,
                                id: item.part.value,
                                label: item.partLabel.value,
                                parent: item.id.value,
                                //tabId: options.tabId,
                            },
                        })
                }

            })

            jstreeData=common.array.sort(jstreeData,"text")



            JstreeWidget.addNodesToJstree(self.rdlJstreeDiv,null, jstreeData, null, function(){
                JstreeWidget.openNode(self.rdlJstreeDiv,node.id)


            })




        })




    }

    self.showNodeInfos=function(node){
        NodeInfosWidget.showNodeInfos(node.data.source,node, "rdl-viewer-infosDiv",{  noDialog:true})
    }




    return self;
})();
export default RDLviewer_main;
window.RDLviewer_main = RDLviewer_main