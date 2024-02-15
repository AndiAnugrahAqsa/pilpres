function getVoteData(){
    return $.get({
        url: 'https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json',
        dataType : "json",
    })
}
function getProvinces(){
    return $.get({
        url: 'https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json',
        dataType : "json",
    })
}

async function index() {
    votesData = await getVoteData();
    provinces = await getProvinces();
    chart = votesData.chart
    progres = votesData.progres
    table = votesData.table

    $('#votesEntrancePersentage').text(`${chart.persen}% || ${progres.progres} dari ${progres.total} TPS`)
    $('#lastUpdateTime').text(`${votesData.ts}`)

    totalVotes = 0;
    candidateVotes = []
    Object.keys(chart).forEach(function (item) {
        if (item !== 'persen') {
            candidateVotes.push(chart[item])
            totalVotes += chart[item];
        }
    });

    $('#mainChart div.progress').each(function(i){
        $(this).width(`${candidateVotes[i]/totalVotes*100}%`)
    })

    $('#mainChart div.progress-bar').each(function(i){
        $(this).text(`0${i+1} ( ${Number(candidateVotes[i]/totalVotes*100).toFixed(2)}% )`)
    })

    Object.keys(table).forEach(function (item, i) {
        totalProvinceVote = table[item][100025] + table[item][100026] + table[item][100027]
        provinceVotes = [table[item][100025], table[item][100026], table[item][100027]]

        if (table[item].persen) {
            $('#provinceVotesList').append((`
                <tr>
                    <td>${i+1}</td>
                    <td>${provinces.find(province => province.kode == item).nama}</td>
                    <td>${table[item].persen}%</td>
                    <td class="${(Math.max(...provinceVotes) == table[item][100025]) && "bg-success"} pe-0">${table[item][100025]}</td>
                    <td class="${(Math.max(...provinceVotes) == table[item][100025]) && "bg-success"} ps-0">(${Number(table[item][100025]/totalProvinceVote*100).toFixed(2)}%)</td>
                    <td class="${(Math.max(...provinceVotes) == table[item][100026]) && "bg-info"} pe-0">${table[item][100026]}</td>
                    <td class="${(Math.max(...provinceVotes) == table[item][100026]) && "bg-info"} ps-0">(${Number(table[item][100026]/totalProvinceVote*100).toFixed(2)}%)</td>
                    <td class="${(Math.max(...provinceVotes) == table[item][100027]) && "bg-danger"} pe-0">${table[item][100027]}</td>
                    <td class="${(Math.max(...provinceVotes) == table[item][100027]) && "bg-danger"} ps-0">(${Number(table[item][100027]/totalProvinceVote*100).toFixed(2)}%)</td>
                </tr>
            `))      
        }else{
            $('#provinceVotesList').append((`
                <tr>
                    <td>${i+1}</td>
                    <td>${provinces.find(province => province.kode == item).nama}</td>
                    <td>${table[item].persen}%</td>
                    <td class="pe-0">0</td>
                    <td class="ps-0">(0%)</td>
                    <td class="pe-0">0</td>
                    <td class="ps-0">(0%)</td>
                    <td class="pe-0">0</td>
                    <td class="ps-0">(0%)</td>
                </tr>
            `))      

        }
    });
}

index()