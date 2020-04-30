
    $(document).ready(function () {
       
        //Novedades
        //variables
        let novedades = '';
        let masInfo = '';
        const date = new Date();
        let desde = new Date(date.getFullYear(), date.getMonth(), 1);
        let hasta = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //console.log('Desde: '+desde+'-'+hasta);
        let resultadoFiltrado;
        
        //EVENTOS
        //muestra info aficional
        $(document).on("click",".crsl-item", function(){
            let id = $(this).attr('id');
            //esconde todas las estuvieran abiertas
            $('.masInfo').css('display', 'none');
            //muestra info
            $('#info_'+id).show('slow');
        });
        $(document).on("click",".crsl-item a", function(e){
            e.preventDefault();
        })
        $(document).on("click","#cierre", function(){
            $(this).parent().hide('slow');
        })
        $(document).on("click",".crsl-nav .previous", function(e){
            e.preventDefault();
            console.log('prev');
            $('#foo').animate({'right' : '30px'});                
        })
        
        //pedido ajax
        $.ajax({
            url : 'assets/js/novedades.json',
            type : 'GET',
            dataType : 'json',
            success : function(data) {
            //ordena por mes vigente
            ordenaNovedades(data)
            console.log(data);
            //data.sort(custom_sort);
            $.each(resultadoFiltrado, function (key, val) {
                //console.log('Base '+val.fecha);
                let fecha_json = new Date(val.fecha);
                fecha_json.setDate(fecha_json.getDate() + 1);
                //console.log('Convertida '+fecha_json)
                novedades += '<div id="item_'+val.id+'" class="crsl-item';
                //si es del mes corriente, agrega clase
                if(fecha_json >= desde && fecha_json <= hasta){
                    //console.log('Dia del mes');
                    novedades += ' mes-activo ';                
                }
                novedades += '"><div><img src="assets/img/novedades/'+val.imagenNoticia+'" width="100%" alt=""><h3>'+ val.tituloNoticia +'</h3><p>'+ val.textoNoticia +'</p><a class="txtVerde txtNegrita" href="'+ val.i+'">LEER MÁS '+ val.id +'</a></div>\n';
                //mas info
                masInfo += '<div class="masInfo" id="info_item_'+ val.id +'"><i id="cierre" class="txtBlanco fas fa-times"></i><div><h3 class="txtBlanco">'+val.tituloNoticia+'</h3><h3 class="txtVerde">'+val.textoNoticia+'</h3><p class="txtBlanco">'+val.cuerpoNoticia+'</p><p class="txt11 txtVerde">'+val.palabrasNoticia+'</p><h6>'+val.fecha+'</h6></div></div>';
            });
            //modifica el DOM
            $('.crsl-wrap').append(novedades);
            $('#masInfo').append(masInfo)
            },
            error : function(xhr, status, error) {
                //alert('Disculpe, existió un problema Status: '+ status + ' error:+ error);
            },
            // código a ejecutar sin importar si la petición falló o no
            complete : function(xhr, status) {
                //console.log('Petición realizada');
                //activa carrousel
                $('.crsl-items').carousel({ visible: 4, itemMinWidth: 200, itemMargin: 10 })
            }
        })
        
        //FUNCIONES
        //ordena por fecha cronológica
        function ordenaNovedades(data){
            let futureDates = data.filter(x => new Date(x.fecha) >= desde);
            let pastDates = data.filter(x => new Date(x.fecha) < desde);
            //ordena los regisros por dia
            futureDates.sort(custom_sort);
            pastDates.sort(custom_sort);
        
            let ultimo =  pastDates.slice(-1)[0];//guarda el ultimo registro
            //console.log(ultimo);
            pastDates.pop();//borra al ultimo para que no se duplique
            futureDates.unshift(ultimo); //agrega al principio
            resultadoFiltrado = futureDates.concat(pastDates);//nueva cadena con todo
        }
        
        function custom_sort(a, b) { 
            let fecha_a = new Date(a.fecha);
            //corrige distorcion de fechas
            fecha_a.setDate(fecha_a.getDate() + 1);
        
            let fecha_b = new Date(b.fecha);
            fecha_b.setDate(fecha_b.getDate() + 1);
        
            return fecha_a - fecha_b;
            //return new Date(a.fecha).getDate() - new Date(b.fecha).getDate();   
        }
        

        
})
      