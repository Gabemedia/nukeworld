<template>
    <button class="btn btn-primary m-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLokalNyt">
        LokalNyt
      </button>
        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasLokalNyt" aria-labelledby="offcanvasLokalNyt">
          <div class="offcanvas-body">
            <div class="col-12" v-for="post in posts" :key="post.id">
              <div class="card my-2">
                <div class="card-header">
                    <h2 v-html="post.title.rendered"></h2>
                </div>
                <div class="card-body">
                  <div v-html="post.content.rendered"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <script>
      
      export default {
        name: 'LokalNyt',
        
        data() {
            return {
            posts: [],
            };
        },
        mounted() {
            fetch('https://lokalnytodense.dk/wp-json/wp/v2/posts')
            .then(response => response.json())
            .then(data => {
                this.posts = data;
            });
        },
      };
      </script>
      
      <style scoped>
      
      /* Add styles for your character info offcanvas */
      .offcanvas {
        font-family: Arial, sans-serif;
      }
      
      .card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .card-header {
        font-weight: bold;
        color: #666;
        font-size: 1.2em;
      }
      
      .card-body > .row > .col-md-4 > .card {
        margin-bottom: 20px;
      }
      </style>