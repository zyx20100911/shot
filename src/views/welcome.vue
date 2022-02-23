<template>
  <el-tree
      :props="props"
      :load="loadNode"
      lazy
      refe="pTreeRef"
      >
  </el-tree>
</template>

<script>
    export default {
        name: "welcome",
      data() {
        return {
          props: {
            label: 'title',
            children: 'children',
            isLeaf: 'leaf'
          },
          dirData:[],
          originalDir:[]
        };
      },
      mounted() {
        this.changeData()
        // console.log(this.originalDir)
       // this.getNewData()
      },
      methods: {
          changeData(){
            this.originalDir = [
              {
                "id": 8,
                "title": "parent_id:4",
                "parent_id": 4
              },
              {
                "id": 2,
                "title": "张小二,parent_id:1",
                "parent_id": 8
              },
              {
                "id": 5,
                "title": "张小二,parent_id:1",
                "parent_id": 1
              },
              {
                "id": 6,
                "title": "张小二,parent_id:1",
                "parent_id": 1
              },
              {
                "id": 3,
                "title": "张小2,parent_id:2",
                "parent_id": 2
              }
            ]
          },

        /**
         * 生成tree
         * @param parent_id 父id
         */
         initTree (arr,parent_id)  {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const children =  arr.filter(item => item.parent_id === parent_id)
          console.log(children);
          // 第一次：循环parent_id为-1数组
      return children.map(item => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(arr,item.id)
      }))
    },


        loadNode(node, resolve) {
          if (node.level === 0) {
            // 手动添加根数据，因为接口现在还没
            // level === 0 根数据，接口只传projectId
            return resolve([  {
              id:2,
              title: "张三",
              parent_id: 0
            },
              {
                id: 1,
                title: "张1三",
                parent_id: 0
              },
              {
                id: 4,
                title: "张5三",
                parent_id: 0
              }
            ])
          }
          if (node.level > 0 ) {
            //如果level>0,发送请求参数为projectId、dirId拿到子目录数据，将子目录渲染上tree：resolve（子目录data）
            //且将子目录数据传入原始数据（push）
            //递归原始数据，将结构做成嵌套的数据丢给仓库存

            console.log(node)
            this.dirData =  this.initTree(this.originalDir,node.data.parent_id)
            console.log(this.dirData)
            return resolve(this.dirData)
          }
/*
          setTimeout(() => {
            const data = [{
              name: 'leaf',
              leaf: true
            }, {
              name: 'zone'
            }];

            resolve(data);
          }, 500);*/
        }
      }

    }
</script>

<style scoped>

</style>
